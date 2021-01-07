import os
import shutil
import subprocess
import typing
import unittest

from codegen.cli import main as run_codegen
from codegen.tests.system.utils import TEST_DIR, TestFile
from codegen.utils import logger

def _build_test_case(*,
                     filename: str,
                     protocol: str,
                     role: str,
                     server: typing.Optional[str] = None) -> typing.Type[unittest.TestCase]:

    target = 'node' if server is None else 'browser'
    parent_output_dir = os.path.abspath(os.path.join('web-sandbox', target))

    class CodeGenerationTest(unittest.TestCase):

        def setUp(self):

            self.npm_test_cmd = [f'cd {parent_output_dir}', 'npm test']
            self.output_dir = os.path.join(parent_output_dir, protocol)

            if os.path.exists(self.output_dir) and os.path.isdir(self.output_dir):
                shutil.rmtree(self.output_dir)

        def test_code_generation(self):

            print()
            flags = [os.path.join(TEST_DIR, 'examples', filename), protocol, role, target]
            if target == 'browser':
                flags += ['-s', server]
            
            phase = 'Run codegen'
            exit_code = run_codegen(flags)
            if exit_code != 0:
                logger.FAIL(phase)
            else:
                logger.SUCCESS(phase)

            self.assertEqual(exit_code, 0)

            phase = 'Check TypeScript code'
            npm_test_cmd = [f'cd {parent_output_dir}', 'npm test']
            completion = subprocess.run(' && '.join(npm_test_cmd), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            exit_code = completion.returncode
            if exit_code != 0:
                logger.FAIL(phase)

                if completion.stdout:
                    logger.ERROR('stdout', completion.stdout)

                if completion.stderr:
                    logger.ERROR('stderr', completion.stderr)
            else:
                logger.SUCCESS(phase)
                shutil.rmtree(self.output_dir)

            self.assertEqual(exit_code, 0)
            print()

    test_name = f'{filename}: {protocol}::{role} <{target}>'
    CodeGenerationTest.__name__ = test_name
    CodeGenerationTest.__qualname__ = test_name
    return CodeGenerationTest


def build_test_suite(tests: typing.List[TestFile]) -> unittest.TestSuite:

    suite = unittest.TestSuite()
    for test in tests:
        for protocol in test.protocols:
            TestCase = _build_test_case(filename=test.filename,
                                        protocol=protocol.identifier,
                                        role=protocol.server)

            suite.addTests(unittest.makeSuite(TestCase))

            for client in protocol.clients:
                TestCase = _build_test_case(filename=test.filename,
                                            protocol=protocol.identifier,
                                            role=client,
                                            server=protocol.server)

                suite.addTests(unittest.makeSuite(TestCase))

    return suite