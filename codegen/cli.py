from argparse import ArgumentParser
import typing

from codegen.automata import Endpoint, parser as automata_parser
from codegen.generator import CodeGenerator
from codegen.utils import logger, role_parser, scribble, type_declaration_parser

def parse_arguments(args: typing.List[str]) -> typing.Dict:
    """Prepare command line argument parser and return the parsed arguments
    from the specified 'args'."""

    parser = ArgumentParser()

    parser.add_argument('filename',
                        type=str, help='Path to Scribble protocol')

    parser.add_argument('protocol',
                        type=str, help='Name of protocol')

    parser.add_argument('role',
                        type=str, help='Role to project')

    parser.add_argument('target',
                        choices=['node', 'browser'], help='Code generation target')

    parser.add_argument('-s', '--server',
                        type=str, help='Server role (only applicable for browser targets)')

    parser.add_argument('-o', '--output',
                         type=str, help='Output directory for generation')

    parsed_args = parser.parse_args(args)
    return vars(parsed_args)


def main(args: typing.List[str]) -> int:
    """Main entry point, return exit code."""

    parsed_args = parse_arguments(args)

    target = parsed_args['target']
    server = parsed_args['server']
    role = parsed_args['role']
    protocol = parsed_args['protocol']
    output_dir = parsed_args['output']
    scribble_filename = parsed_args['filename']

    if target == 'browser' and server is None:
        # 'server' flag must be provided if the codegen target is the browser.

        logger.ERROR('target==browser, so the following arguments are required: server')
        return 1

    if target == 'browser' and server == role:
        # 'server' flag must be provided if the codegen target is the browser.

        logger.ERROR('Browser role cannot be the server role.')
        return 1

    try:
        phase = f'Parse FSM from {scribble_filename}'
        with type_declaration_parser.parse(scribble_filename) as custom_types:

            exit_code, output = scribble.get_graph(scribble_filename, protocol, role)
            if exit_code != 0:
                logger.FAIL(phase)
                logger.ERROR(output)
                return exit_code

            logger.SUCCESS(phase)
    except (OSError, ValueError) as error:
        logger.ERROR(error)
        return 1
    
    phase = f'Parse endpoint IR from Scribble output'
    try:
        efsm = automata_parser.from_data(output)
        logger.SUCCESS(phase)
    except ValueError as error:
        logger.FAIL(phase)
        logger.ERROR(error)
        return 1

    all_roles = role_parser.parse(parsed_args['filename'], parsed_args['protocol'])
    other_roles = all_roles - set([parsed_args['role']])

    endpoint = Endpoint(protocol=protocol,
                        role=role,
                        other_roles=other_roles,
                        server=server,
                        efsm=efsm,
                        types=custom_types)

    codegen = CodeGenerator(target=target, output_dir=output_dir)
    phase = f'Generate all {target} artifacts in {codegen.output_dir}'
    try:
        exit_code = codegen.generate(endpoint)
        if exit_code != 0:
            logger.FAIL(phase)
        else:
            logger.SUCCESS(phase)

        return exit_code
    except Exception as error:
        logger.FAIL(phase)
        logger.ERROR(error)
        return 1