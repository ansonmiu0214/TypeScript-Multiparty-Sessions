from abc import ABC, abstractmethod
from dataclasses import dataclass, field
import re
from typing import List, Mapping, Optional, Set

@dataclass
class Action(ABC):
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

class SendAction(Action, delimiter='!'):

    def add_to_efsm(self, state_id: str, efsm: 'EfsmBuilder'):
        efsm.add_action_to_send_state(state_id, self)

class ReceiveAction(Action, delimiter='?'):

    def add_to_efsm(self, state_id: str, efsm: 'EfsmBuilder'):
        efsm.add_action_to_receive_state(state_id, self)

class State(ABC):
    
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

    def __init__(self, nodes: List[str]):
        self._roles = set()
        self._send_states = {}
        self._receive_states = {}
        self._initial_state_id = min(nodes)
        self._terminal_state_candidates = set(nodes)

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

    def build(self) -> 'EFSM':
        if len(self._terminal_state_candidates) > 1:
            raise Exception(f'Too many candidates for terminal state: {self._terminal_state_candidates}')

        terminal_state_id = next(iter(self._terminal_state_candidates)) if self._terminal_state_candidates else None
        return EFSM(
            self._roles,
            self._send_states,
            self._receive_states,
            self._initial_state_id,
            terminal_state_id
        )

@dataclass
class EFSM:
    _role: Set[str]
    _send_states: Mapping[str, SendState]
    _receive_states: Mapping[str, ReceiveState]
    _initial_state_id: str
    _terminal_state_id: Optional[str]

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