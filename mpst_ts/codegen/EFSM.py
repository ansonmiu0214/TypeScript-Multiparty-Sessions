from abc import ABC, abstractmethod
from dataclasses import dataclass, field
import re
from typing import List, Mapping, Optional, Set

@dataclass
class Action(ABC):
    """Base class for EFSM transitions."""
    role: str
    label: str
    succ_id: str
    payloads: List[str]
    succ: 'State' = field(init=False)

    _label_regex = '(?P<role>.+)(?P<op>[!?])(?P<label>.+)\((?P<payloads>.*)\)'
    _delimit_to_cnstr = {}

    @classmethod
    def __init_subclass__(cls, *, delimiter: str):
        Action._delimit_to_cnstr[delimiter] = cls
        return super().__init_subclass__()

    @classmethod
    def parse(cls, efsm_str: str, succ_id: str) -> 'Action':
        matcher = re.match(cls._label_regex, efsm_str)
        if not matcher:
            raise ValueError(f'Invalid action: "{efsm_str}"')

        components = matcher.groupdict()
        Cnstr = Action._delimit_to_cnstr.get(components['op'])
        if not Cnstr:
            raise ValueError(f'Unsupported operation: "{components["op"]}"')

        payloads = [payload.strip() for payload in components['payloads'].split(',') if payload.strip()]
        return Cnstr(role=components['role'],
                     label=components['label'],
                     succ_id=succ_id,
                     payloads=payloads)

    @abstractmethod
    def add_to_efsm(self, state_id: str, efsm: 'EfsmBuilder'):
        pass

    def __eq__(self: 'Action', other):
        if not isinstance(other, self.__class__):
            return False
        
        return self.label == other.label and \
            self.role == other.role and \
            self.succ_id == other.succ_id and \
            self.payloads == other.payloads

class SendAction(Action, delimiter='!'):

    def add_to_efsm(self, state_id: str, efsm: 'EfsmBuilder'):
        efsm.add_action_to_send_state(state_id, self)

class ReceiveAction(Action, delimiter='?'):

    def add_to_efsm(self, state_id: str, efsm: 'EfsmBuilder'):
        efsm.add_action_to_receive_state(state_id, self)

class State(ABC):
    """Base class for EFSM state."""
    
    def __init__(self, state_id):
        super().__init__()
        self._id = state_id

    @property
    def id(self):
        return self._id

    def __str__(self):
        return self.id

    def __repr__(self):
        return f'{self.__class__.__name__}(id={self.id}'

class TerminalState(State):
    pass

class NonTerminalState(State, ABC):
    _actions: Mapping[str, Action]

    def __init__(self, state_id: str):
        super().__init__(state_id)
        self._actions = {}

    @property
    def role(self):
        return next(iter(self.actions)).role

    @property
    def labels(self):
        return self._actions.keys()

    @property
    def actions(self):
        return self._actions.values()

    def add_action(self, action: Action):
        if action.label in self._actions:
            raise ValueError(f'Duplicate action: label "{action.label}" ' 
                             f'already exists in S{self.id}')

        self._actions[action.label] = action

    def __getitem__(self, label):
        return self._actions[label]

    def __eq__(self: 'NonTerminalState', other):
        if not isinstance(other, self.__class__):
            return False
        
        my_actions = list(self._actions.items())
        other_actions = list(other._actions.items())

        return self.role == other.role and \
            sorted(my_actions) == sorted(other_actions)

class SendState(NonTerminalState):
    pass

class ReceiveState(NonTerminalState):
    pass

class EfsmBuilder:
    _role: Set[str]
    _send_states: Mapping[str, SendState]
    _receive_states: Mapping[str, ReceiveState]
    _initial_state_id: str
    _terminal_state_candidates: Set[str]
    _state_id_lookup: Mapping[str, str]

    def __init__(self, nodes: List[str]):
        self._roles = set()
        self._send_states = {}
        self._receive_states = {}
        self._initial_state_id = str(min(int(node) for node in nodes))
        self._terminal_state_candidates = set(nodes)
        self._state_id_lookup = {node: node for node in nodes}

    def add_action_to_send_state(self, state_id: str, action: SendAction):
        send_state = self._send_states.get(state_id, SendState(state_id))
        send_state.add_action(action)
        self._send_states[state_id] = send_state

        self._roles.add(action.role)
        self._terminal_state_candidates.discard(state_id)

    def add_action_to_receive_state(self, state_id: str, action: SendAction):
        receive_state = self._receive_states.get(state_id, ReceiveState(state_id))
        receive_state.add_action(action)
        self._receive_states[state_id] = receive_state

        self._roles.add(action.role)
        self._terminal_state_candidates.discard(state_id)

    def _prune_overlaping_states(self):

        should_prune_again = False

        skip_set = set()
        for curr_id, curr_state in sorted(self._send_states.items()):
            if curr_id in skip_set:
                continue

            same_states = [other_id for other_id, other_state in self._send_states.items()
                           if other_id != curr_id and other_state == curr_state]
            if same_states:
                should_prune_again = True
                # print(f'{curr_id} equal to {", ".join(same_states)}')
                for other_id in same_states:
                    self._state_id_lookup[other_id] = curr_id
                    skip_set.add(other_id)
                    del self._send_states[other_id]
        
        skip_set = set()

        for curr_id, curr_state in sorted(self._receive_states.items()):
            if curr_id in skip_set:
                continue

            same_states = [other_id for other_id, other_state in self._receive_states.items()
                           if other_id != curr_id and other_state == curr_state]
            if same_states:
                should_prune_again = True
                # print(f'{curr_id} equal to {", ".join(same_states)}')
                for other_id in same_states:
                    self._state_id_lookup[other_id] = curr_id
                    skip_set.add(other_id)
                    del self._receive_states[other_id]

        if should_prune_again:
            # Deep updates of successor state IDs in actions
            for state in [*self._send_states.values(), *self._receive_states.values()]:
                for action in state.actions:
                    action.succ_id = self._state_id_lookup[action.succ_id]

            self._prune_overlaping_states()

    def build(self) -> 'EFSM':
        # Prune overlapping states
        self._prune_overlaping_states()

        initial_state_id = self._state_id_lookup[self._initial_state_id]

        if len(self._terminal_state_candidates) > 1:
            raise Exception(f'Too many candidates for terminal state: {self._terminal_state_candidates}')

        if self._terminal_state_candidates:
            terminal_state_id = self._state_id_lookup[next(iter(self._terminal_state_candidates))]
        else:
            terminal_state_id = None

        return EFSM(
            self._roles,
            self._send_states,
            self._receive_states,
            initial_state_id,
            terminal_state_id,
            self._state_id_lookup
        )

@dataclass
class EFSM:
    _role: Set[str]
    _send_states: Mapping[str, SendState]
    _receive_states: Mapping[str, ReceiveState]
    _initial_state_id: str
    _terminal_state_id: Optional[str]
    _state_id_lookup: Mapping[str, str]

    _states: Mapping[str, State] = field(init=False)

    def __post_init__(self):
        self._states = dict(**self._send_states, **self._receive_states)
        if self._terminal_state_id is not None:
            self._states[self._terminal_state_id] = TerminalState(self._terminal_state_id)

        # Deep linking of successor states in actions
        for state in self.nonterminal_states:
            for action in state.actions:
                action.succ = self[action.succ_id]

    @property
    def other_roles(self):
        return self._role

    @property
    def states(self):
        yield from self._states.values()

    @property
    def send_states(self):
        yield from self._send_states.values()

    @property
    def receive_states(self):
        yield from self._receive_states.values()

    @property
    def nonterminal_states(self):
        yield from self.send_states
        yield from self.receive_states

    @property
    def initial_state(self):
        return self[self._initial_state_id]

    def has_terminal_state(self):
        return self._terminal_state_id is not None

    def is_send_state(self, state: State):
        return state.id in self._send_states
    
    def is_receive_state(self, state: State):
        return state.id in self._receive_states

    def is_terminal_state(self, state: State):
        return state.id == self._terminal_state_id

    @property
    def terminal_state(self):
        if not self.has_terminal_state():
            raise Exception(f'Trying to access non-existent terminal state')

        return self[self._terminal_state_id]

    def __getitem__(self, state_id: str):
        return self._states[state_id]