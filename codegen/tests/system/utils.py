from abc import ABC
from dataclasses import dataclass
import json
import os
from pathlib import Path
import typing

TEST_DIR = os.path.dirname(__file__)
_CONFIG_FILE = os.path.join(TEST_DIR, 'config.json')


@dataclass
class TestProtocol:
    identifier: str
    server: str
    clients: typing.List[str]

    @classmethod
    def from_dict(cls, data: typing.Dict) -> 'TestProtocol':

        identifier = data['identifier']
        server = data['server']
        clients = data['clients']
        
        return cls(identifier, server, clients)


@dataclass
class TestFile:
    filename: str
    protocols: typing.List[TestProtocol]

    @classmethod
    def from_dict(cls, data: typing.Dict) -> 'TestFile':

        filename = data['filename']
        protocols = [TestProtocol.from_dict(protocol)
                     for protocol in data['protocols']]
        
        return cls(filename, protocols)


def parse_config() -> typing.List[TestFile]:

    f = Path(_CONFIG_FILE)
    test_config = json.loads(f.read_text())
    return [TestFile.from_dict(test) for test in test_config['tests']]
     