import sys

def INFO(*args):
    print('| INFO:', *args, file=sys.stdout)


def ERROR(*args):
    print('| ERROR:', *args, file=sys.stderr)


def SUCCESS(*args):
    print(u'\u2714', *args, file=sys.stdout)


def FAIL(*args):
    print(u'\u2718', *args, file=sys.stdout)