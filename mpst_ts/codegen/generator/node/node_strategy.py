import os

from ..utils import CodeGenerationStrategy
from ...EFSM import EFSM
from ....utils import TemplateGenerator

class NodeStrategy(CodeGenerationStrategy,
                   target='node'):

    def __init__(self):
        super().__init__()

        dirname = os.path.join(os.path.dirname(__file__), 'templates')
        self.template_generator = TemplateGenerator(dirname=dirname)

    def generate(self, efsm: EFSM):
        """

        Files to generate:
            {Protocol}/EFSM.ts
            {Protocol}/{Role}.ts

        Returns:
            A generator of (filepath, content_to_write).
        """

        files = []
        protocol = efsm.metadata['protocol']
        role = efsm.metadata['role']

        # Generate EFSM
        files.append((f'sandbox/node/{protocol}/EFSM.ts',
                      self.template_generator.render(path='efsm.ts.j2',
                                                     payload={'efsm': efsm})))

        # Generate runtime
        files.append((f'sandbox/node/{protocol}/{role}.ts',
                      self.template_generator.render(path='runtime.ts.j2',
                                                     payload={'efsm': efsm})))

        return files