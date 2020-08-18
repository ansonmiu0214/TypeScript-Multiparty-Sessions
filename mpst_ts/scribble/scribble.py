import os
import subprocess
import typing

DEFAULT_SCRIBBLE_ROOT = './scribble-java'

def get_graph(filename: str, protocol: str, role: str) -> typing.Tuple[int, str]:
    """Obtain EFSM from Scribble Java. Returns exit code and command line output."""

    command = build_scribble_command(filename=filename, protocol=protocol, role=role)
    completion = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return_code = completion.returncode
    output = completion.stderr if return_code else completion.stdout
    return return_code, output.decode('utf-8').strip()

def build_scribble_command(*, filename: str, protocol: str, role: str) -> str:
    scribble_root = os.environ.get('SCRIBBLE_ROOT', DEFAULT_SCRIBBLE_ROOT)
    scribble_sh = os.path.join(scribble_root, 'scribble-dist', 'target', 'scribblec.sh')
    return (scribble_sh, filename, '-fsm', protocol, role)

def get_png(filename: str, protocol: str, role: str):
    scribble_root = os.environ.get('SCRIBBLE_ROOT', DEFAULT_SCRIBBLE_ROOT)
    scribble_sh = os.path.join(scribble_root, 'scribble-dist', 'target', 'scribblec.sh')

    completion = subprocess.run(
        (scribble_sh, filename, '-fsmpng', protocol, role, f'{protocol}_{role}.png'),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    return completion