from dataclasses import dataclass
import re
import typing

@dataclass(frozen=True, eq=True)
class DataType:
    external: str
    alias: str
    path: str

    _regex = 'type <typescript> "(?P<external>[a-zA-Z]+)" from "(?P<path>.*?)" as (?P<alias>[a-zA-Z]+);'

    @classmethod
    def from_primitive(cls, name: str) -> 'DataType':
        return cls(external=name, alias=name, path='')

    @classmethod
    def from_primitives(cls, *names: typing.Iterable[str]) -> typing.Iterable['DataType']:
        return (cls.from_primitive(name) for name in names)
    
    @classmethod
    def from_regex(cls, string: str) -> 'DataType':
        matcher = re.match(cls._regex, string)
        if not matcher:
            raise ValueError(f'Cannot parse type declaration: "{string}"')
            
        components = matcher.groupdict()
        return cls(**components)

    def to_scribble(self) -> str:
        return f'type <typescript> "{self.external}" from "{self.path}" as {self.alias};\n'


def process(filepath: str) -> typing.Iterable[DataType]:
    """
    Process type declarations from Scribble file.
    """

    with open(filepath, 'r') as file_:
        lines = list(file_)
    
    # Parse type declarations
    type_decls = [(line_num, DataType.from_regex(line.strip()))
                  for line_num, line in enumerate(lines)
                  if line.startswith('type')]

    existing_types = set(type_decl for _, type_decl in type_decls)

    primitives = set(DataType.from_primitives('number', 'boolean', 'string'))

    to_add = primitives - existing_types

    if type_decls:
        line_to_insert = max(line_num for line_num, _ in type_decls) + 1
    else:
        # No existing type declarations:
        # just insert after module line
        line_to_insert = 1
    
    # Add missing type declarations
    updated_lines = lines[:line_to_insert] + [primitive.to_scribble() for primitive in to_add] + lines[line_to_insert:]

    with open(filepath, 'w') as file_:
        file_.write(''.join(updated_lines))

    custom_types = existing_types - primitives
    return custom_types