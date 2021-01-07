from argparse import ArgumentParser
import os
import subprocess
import sys

parser = ArgumentParser()
parser.add_argument('-m', '--messages', 
    nargs='+', help='configuration of messages to test, e.g. "-m 100 1000 10000"', required=True)
parser.add_argument('-r', '--runs',
    type=int, help='number of runs per benchmark, e.g. "-r 20"', required=True)

args = parser.parse_args()

messages = args.messages
runs = args.runs

try:
    messages = [int(numMessages) for numMessages in messages]
except:
    print('Invalid argument for "messages"', messages, file=sys.stderr)
    sys.exit(1)

print('Configuration:')
for key, val in vars(args).items():
    print(f'  {key} = {val}')
print()

scriptDir = os.path.abspath(os.path.dirname(__file__))
for numMessages in messages:

    for variant in ('bare', 'mpst'):
        command = [
            os.path.join(scriptDir, f'{variant}.sh'),
            '-m',
            str(numMessages),
            '-r',
            str(runs)
        ]

        print(f'({variant}) NumMessages={numMessages}, Runs={runs}')
        
        completion = subprocess.run(' '.join(command), shell=True)
        print()