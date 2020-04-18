from dataclasses import dataclass
import typing

from .efsm import EFSM
from ..utils.type_declaration import DataType

@dataclass
class Endpoint:
    protocol: str
    role: str
    efsm: EFSM
    types: typing.Iterable[DataType]

    pass