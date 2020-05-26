from argparse import ArgumentParser
import os
import sys
import typing

import mpst_ts.codegen as codegen
import mpst_ts.codegen.generator as generator
import mpst_ts.scribble as scribble
import mpst_ts.utils as utils

def get_argument_parser() -> ArgumentParser:
    parser = ArgumentParser()

    supported_targets = generator.utils.CodeGenerationStrategy.target_to_strategy.keys()

    parser.add_argument('filename', type=str, help='Path to Scribble protocol')
    parser.add_argument('protocol', type=str, help='Name of protocol')
    parser.add_argument('role', type=str, help='Role to project')
    parser.add_argument('target', choices=supported_targets, help='Code generation target')

    # FIXME: use subparsers for this?
    parser.add_argument('-s', '--server', type=str, help='Server role (only applicable for browser targets)')

    parser.add_argument('-o', '--output', type=str, help='Output directory for generation')

    return parser

def main(args: typing.List[str]) -> int: 
    parser = get_argument_parser()
    parsed_args = parser.parse_args(args)

    # Ad-hoc server flag validation -- must be provided if target is browser
    # FIXME: use subparsers for this?
    if parsed_args.target == 'browser' and parsed_args.server is None:
        print('Error: target==browser, so the following arguments are required: server', file=sys.stderr)
        return 1

    try:
        custom_types = utils.type_declaration.process(parsed_args.filename)
    except (OSError, ValueError) as err:
        print(err, file=sys.stderr)
        return 1

    return_code, output = scribble.get_graph(parsed_args.filename, parsed_args.protocol, parsed_args.role)
    if return_code:
        print(output, file=sys.stderr)
        return return_code

    efsm = codegen.parse.from_data(output)
    # Ad-hoc server flag validation -- must be provided if target is browser
    # FIXME: use subparsers for this?
    if parsed_args.target == 'browser' and parsed_args.server not in efsm.other_roles:
        print(f'Error: target==browser, but server "{parsed_args.server}" not found in: {efsm.other_roles}', file=sys.stderr)
        return 1

    endpoint = codegen.Endpoint(protocol=parsed_args.protocol,
                                role=parsed_args.role,
                                server=parsed_args.server,
                                efsm=efsm,
                                types=custom_types)

    code_generator = generator.CodeGenerator(target=parsed_args.target, output_dir=parsed_args.output)
    code_generator.generate(endpoint)

    return 0