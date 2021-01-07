from abc import ABC
import typing

class State(ABC):

    def __init__(self, state_id: str):
        super().__init__()
        self._id = state_id

    @property
    def id(self) -> str:
        """Return state identifier."""

        return self._id

    def __str__(self):
        return self.id

    def __repr__(self):
        return f'{self.__class__.__name__}(id={self.id})'


class TerminalState(State):
    pass


class NonTerminalState(State, ABC):

    _actions: typing.Dict[str, 'Action']

    def __init__(self, state_id: str):
        super().__init__(state_id)
        self._actions = {}

    @property
    def role(self) -> str:
        """Return the role that this state is either receiving from, or sending to."""

        return next(iter(self.actions)).role

    @property
    def labels(self) -> typing.Iterable[str]:
        """Return the labels of the transitions in this state."""

        return self._actions.keys()

    @property
    def actions(self) -> typing.Iterable['Action']:
        """Return the actions of the transitions in this state."""

        return self._actions.values()

    def add_action(self, action: 'Action'):
        """Add the specified 'action' to this state instance."""

        if action.label in self._actions:
            raise ValueError(f'Duplicate action: label "{action.label}" ' 
                             f'already exists in S{self.id}')

        self._actions[action.label] = action

    def __getitem__(self, label: str) -> 'Action':
        """Index into the State by the specified 'label' to get the
        corresponding Action instance for that labelled transition."""

        return self._actions[label]

    def __eq__(self, other: object) -> bool:
        """Perform deep equality check between two State instances. Two EFSM states
        are deemed equal iff they perform the same IO action (send|receive),
        interact with the same role, and have the same transitions."""

        if not isinstance(other, self.__class__):
            return False
        
        my_actions = list(self._actions.items())
        other_actions = list(other._actions.items())

        # Deep comparison of transitions, regardless of order.
        return self.role == other.role and \
            sorted(my_actions) == sorted(other_actions)


class SendState(NonTerminalState):
    pass


class ReceiveState(NonTerminalState):
    pass