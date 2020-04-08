import os

from ...utils import CodeGenerationStrategy
from ....EFSM import EFSM
from .....utils import TemplateGenerator

class NodeStrategy(CodeGenerationStrategy,
                   target='node'):

    def __init__(self):
        super().__init__()
        self.output_dir = 'sandbox/node'

        dirname = os.path.join(os.path.dirname(__file__), 'templates')
        self.template_generator = TemplateGenerator(dirname=dirname)

    def generate(self, efsm: EFSM):
        """

        Files to generate:
            {protocol}/EFSM.ts
            {protocol}/{role}.ts

        Returns:
            A generator of (filepath, content_to_write).
        """

        files = []
        protocol = efsm.metadata['protocol']
        role = efsm.metadata['role']

        # Generate EFSM
        files.append((os.path.join(self.output_dir, protocol, 'EFSM.ts'),
                      self.template_generator.render(path='efsm.ts.j2',
                                                     payload={'efsm': efsm})))

        # Generate runtime
        files.append((os.path.join(self.output_dir, protocol, f'{role}.ts'),
                      self.template_generator.render(path='runtime.ts.j2',
                                                     payload={'efsm': efsm})))

        return files