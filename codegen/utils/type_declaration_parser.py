from contextlib import contextmanager
from dataclasses import dataclass
import re
from pathlib import Path
import typing

_TYPESCRIPT_PRIMITIVES = ['boolean', 'number', 'string']

@dataclass(frozen=True, eq=True)
class DataType:

    external: str
    alias: str
    path: str

    _SCRIBBLE_REGEX = 'type <typescript> "(?P<external>[a-zA-Z]+)" from "(?P<path>.*?)" as (?P<alias>[a-zA-Z]+);'

    @classmethod
    def of_primitive(cls, typename: str) -> 'DataType':
        """Build DataType instance of primitive type specified by 'typename'."""

        return cls(external=typename, alias=typename, path='')

    @classmethod
    def from_scribble(cls, token: str) -> 'DataType':
        """Parse 'token' as DataType instance from Scribble notation."""

        matcher = re.match(cls._SCRIBBLE_REGEX, token)
        if not matcher:
            raise ValueError(f'Cannot parse type declaration: "{token}"')

        components = matcher.groupdict()
        return cls(**components)

    def to_scribble(self) -> str:
        """Generate type declaration for this data type instance in Scribble notation."""

        return f'type <typescript> "{self.external}" from "{self.path}" as {self.alias};'


@contextmanager
def parse(filename: str) -> typing.Iterator[typing.Set[DataType]]:
    """Process type declarations from Scribble protocol in 'filename'.
    Add missing primitive types, and return the user-defined types.
    
    Revert the file modifications upon exiting the context."""

    f = Path(filename)

    lines = f.read_text().splitlines()

    type_decls = [(line_num, DataType.from_scribble(line.strip()))
                  for line_num, line in enumerate(lines)
                  if line.startswith('type')]

    existing_types = set(type_decl for _, type_decl in type_decls)
    primitives = set(DataType.of_primitive(primitive) for primitive in _TYPESCRIPT_PRIMITIVES)
    primitives_to_add = primitives - existing_types

    if type_decls:
        # Insert after final user-defined type declaration.
        insert_at_line_idx = max(line_num for line_num, _ in type_decls) + 1
    else:
        # No existing type declarations, just insert after module declaration.
        insert_at_line_idx = 1

    user_defined_types = existing_types - primitives

    try:
        # Add missing primitive type declarations.
        updated_lines = lines[:insert_at_line_idx] \
                    + [primitive.to_scribble() for primitive in primitives_to_add] \
                    + lines[insert_at_line_idx:]

        f.write_text('\n'.join(updated_lines))

        yield user_defined_types
    finally:
        # Restore original lines.
        f.write_text('\n'.join(lines))