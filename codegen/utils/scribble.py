import os
from pathlib import Path
from re import sub
import subprocess
import typing

_SCRIBBLE_EXECUTABLE = 'scribblec.sh'
_SCRIBBLE_ENV_VAR = 'SCRIBBLE'

def get_graph(filename: str, protocol: str, role: str) -> typing.Tuple[int, str]:
    """Get dot representation of EFSM from Scribble-Java.
    Return exit code and command line output."""

    scribble_sh = os.environ.get(_SCRIBBLE_ENV_VAR, _SCRIBBLE_EXECUTABLE)
    command = (scribble_sh, filename, '-fsm', protocol, role)

    completion = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    exit_code = completion.returncode
    output = completion.stderr if exit_code != 0 else completion.stdout

    return exit_code, output.decode('utf-8').strip()


def get_png(filename: str, protocol: str, role: str) -> int:
    """Get PNG representation fo EFSM from Scribble-Java. Return exit code."""

    scribble_sh = os.environ.get(_SCRIBBLE_ENV_VAR, _SCRIBBLE_EXECUTABLE)
    command = (scribble_sh, filename, '-fsmpng', protocol, role, f'{protocol}_{role}.png')

    completion = subprocess.run(command)
    return completion.returncode