from abc import ABC, abstractmethod
from dataclasses import dataclass, field
import re
from typing import List, Mapping, Optional, Set

@dataclass
class Action(ABC):
    role: str
    label: str
    succ: int
    payloads: List[str]

    _label_regex = '(?P<role>[a-zA-Z0-9]+)(?P<op>[!?])(?P<label>[a-zA-Z]+)\((?P<payloads>[a-zA-Z]*)\)'
    _delimit_to_cnstr = {}

    @classmethod
    def __init_subclass__(cls, *, delimiter):
        Action._delimit_to_cnstr[delimiter] = cls
        return super().__init_subclass__()

    @classmethod
    def parse(cls, label: str, succ: int) -> 'Action':
        matcher = re.match(cls._label_regex, label)
        if not matcher:
            pass

        components = matcher.groupdict()
        Cnstr = Action._delimit_to_cnstr.get(components['op'])
        if not Cnstr:
            # TODO: action with delimiter {components['op']} not found
            pass

        role = components['role']
        label = components['label']
        payloads = components['payloads'].split(',')
        return Cnstr(role, label, succ, payloads)

    @abstractmethod
    def add_to_efsm(self, state_id: int, efsm: 'EFSMBuilder'):
        pass


class SendAction(Action, delimiter='!'):

    def add_to_efsm(self, state_id: int, efsm: 'EFSMBuilder'):
        efsm.add_send_state(state_id, self)

class ReceiveAction(Action, delimiter='?'):

    def add_to_efsm(self, state_id, efsm: 'EFSMBuilder'):
        efsm.add_receive_state(state_id, self)

@dataclass
class State(ABC):
    _id: int
    _actions: Mapping[str, Action] = field(default_factory=dict)

    def add_action(self, action: Action):
        if action.label in self._actions:
            # TODO: handle duplicate label
            pass

        self._actions[action.label] = action

    @property
    def id(self):
        return self._id

    @property
    def role(self):
        action, *_ = self.actions.values()
        return action.role

    @property
    def actions(self):
        return self._actions
    
    @property
    def labels(self):
        return [action.label for action in self.actions.values()]

class SendState(State):
    pass

class ReceiveState(State):
    pass

class EFSMBuilder:
    _name: str
    _roles: Set[str]
    _send_states: Mapping[int, State]
    _receive_states: Mapping[int, State]
    _initial_state: int
    _terminal_state_candidates: Set[int]
    _metadata: dict

    def __init__(self, name: str, nodes: List[int], metadata):
        self._name = name
        self._roles = set()
        self._send_states = {}
        self._receive_states = {}
        self._initial_state = min(nodes)
        self._terminal_state_candidates = set(nodes)
        self._metadata = metadata

    def add_send_state(self, state: int, action: SendAction):
        send_state = self._send_states.get(state, SendState(state))
        send_state.add_action(action)
        self._send_states[state] = send_state

        self._roles.add(action.role)
        self._terminal_state_candidates.discard(state)

    def add_receive_state(self, state: int, action: ReceiveAction):
        receive_state = self._receive_states.get(state, ReceiveState(state))
        receive_state.add_action(action)
        self._receive_states[state] = receive_state

        self._roles.add(action.role)
        self._terminal_state_candidates.discard(state)

    def build(self):
        if len(self._terminal_state_candidates) > 1:
            # TODO: handle error case with multiple terminal states?
            pass
        
        terminal_state = None
        if self._terminal_state_candidates:
            [terminal_state] = self._terminal_state_candidates
        
        return EFSM(self._name, self._roles, self._send_states, self._receive_states, self._initial_state, terminal_state, self._metadata)


@dataclass    
class EFSM:
    _name: str
    _roles: Set[str]
    _send_states: Mapping[int, State]
    _receive_states: Mapping[int, State]
    _initial_state: int
    _terminal_state: Optional[int]
    _metadata: dict

    @property
    def roles(self):
        return self._roles

    @property
    def initial_state(self):
        return self._initial_state

    @property
    def send_states(self):
        return self._send_states

    def is_send_state(self, state_id):
        return state_id in self.send_states

    @property
    def receive_states(self):
        return self._receive_states
    
    def is_receive_state(self, state_id):
        return state_id in self.receive_states

    def get_receive_states_by_role(self, role):
        return {state_id: receive_state
                for state_id, receive_state in self.receive_states.items()
                if receive_state.role == role}

    @property
    def terminal_state(self):
        return self._terminal_state

    def has_terminal_state(self):
        return self.terminal_state is not None

    def is_terminal_state(self, state_id):
        return state_id == self.terminal_state

    @property
    def states(self):
        return dict(**self.send_states, **self.receive_states)

    @property
    def metadata(self):
        return self._metadata

    def __getitem__(self, item):
        return self.states[item]