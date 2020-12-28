import unittest

from codegen.tests.system.factory import build_test_suite
from codegen.tests.system.utils import parse_config, TestFile
from codegen.utils import logger


if __name__ == "__main__":

    tests = parse_config()
    suite = build_test_suite(tests)

    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)