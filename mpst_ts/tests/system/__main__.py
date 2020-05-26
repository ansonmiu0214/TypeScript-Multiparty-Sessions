import os
import unittest
import shutil
import subprocess

import mpst_ts

from . import protocols_to_test

def test_factory(scr, protocol, role, target, svr=None):

    class CodeGenerationTest(unittest.TestCase):

        def setUp(self):
            self.npm_test_cmd = ' && '.join([f'cd sandbox/{target}', 'npm test'])
            self.output_dir = f'sandbox/{target}/{protocol}'

            if os.path.exists(self.output_dir) and os.path.isdir(self.output_dir):
                shutil.rmtree(self.output_dir)

        def test_code_generation(self):
            flags = [scr, protocol, role, target]
            if svr is not None:
                flags.append('-s')
                flags.append(svr)

            rc = mpst_ts.main(flags)
            self.assertEqual(rc, 0)

            completion = subprocess.run(self.npm_test_cmd, shell=True)
            self.assertEqual(completion.returncode, 0)

            shutil.rmtree(self.output_dir)

    name = f'Test_{scr}_{protocol}_{role}_{target}'
    CodeGenerationTest.__name__ = name
    CodeGenerationTest.__qualname__ = name
    return CodeGenerationTest

if __name__ == "__main__":
    suite  = unittest.TestSuite()
    for scr, protocols in protocols_to_test:
        for protocol, svr, clients in protocols:
            # Test server
            TestClass = test_factory(scr, protocol, svr, 'node')
            suite.addTests(unittest.makeSuite(TestClass))

            # Test clients
            for client in clients:
                TestClass = test_factory(scr, protocol, client, 'browser', svr)
                suite.addTests(unittest.makeSuite(TestClass))

    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)