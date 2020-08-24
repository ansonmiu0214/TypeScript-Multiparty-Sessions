import re

def process(filepath: str, protocol: str):

    with open(filepath, 'r') as file_:
        content = ''.join(file_)
    
    pattern = re.compile(f'protocol {protocol}\((?P<roles>.*?)\)')
    matcher = re.search(pattern, content)
    if not matcher:
        raise ValueError(f'Cannot find protocol: {protocol}')

    unparsed_roles = [role.strip()
                      for role in matcher.groupdict()['roles'].split(',')]
    
    parsed_roles = [role.split(' ')[1].strip()
                    for role in unparsed_roles]

    return parsed_roles