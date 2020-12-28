from pathlib import Path
import re
import typing

def parse(filename: str, protocol: str) -> typing.Set[str]:
    """Parse the roles for the specified 'protocol' found in the
    Scribble specification in the specified 'filename'."""

    content = Path(filename).read_text()

    pattern = re.compile(f'protocol {protocol}\((?P<roles>.*?)\)')
    matcher = re.search(pattern, content)
    if not matcher:
        raise ValueError(f'Cannot find protocol: {protocol}')

    roles = matcher.groupdict()['roles']
    unparsed_roles = [role.strip() for role in roles.split(',')]
    
    parsed_roles = set(role.split(' ')[1].strip()
                       for role in unparsed_roles)

    return parsed_roles