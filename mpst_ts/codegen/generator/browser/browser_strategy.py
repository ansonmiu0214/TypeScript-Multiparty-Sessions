from ..utils import CodeGenerationStrategy
from ...EFSM import EFSM

class BrowserStrategy(CodeGenerationStrategy,
                      target='browser'):

    def generate(self, efsm: EFSM):
        """

        Files to generate:
            

        Returns:
            A generator of (filepath, content_to_write).
        """

        files = []
        protocol = efsm.metadata['protocol']
        role = efsm.metadata['role']

        return files