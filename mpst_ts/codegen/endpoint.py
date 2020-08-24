from dataclasses import dataclass
import typing

from .EFSM import EFSM
from ..utils.type_declaration import DataType

@dataclass
class Endpoint:
    """Intermediate representation: EFSM + metadata"""
    protocol: str
    role: str
    other_roles: typing.Iterable[str]
    server: str
    efsm: EFSM
    types: typing.Iterable[DataType]

    pass