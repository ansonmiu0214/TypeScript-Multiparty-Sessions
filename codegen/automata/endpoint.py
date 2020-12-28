from dataclasses import dataclass
import typing

from codegen.automata.efsm import EFSM
from codegen.utils.type_declaration_parser import DataType

@dataclass
class Endpoint:
    protocol: str
    role: str
    other_roles: typing.Iterable[str]
    server: str
    efsm: EFSM
    types: typing.Iterable[DataType]
