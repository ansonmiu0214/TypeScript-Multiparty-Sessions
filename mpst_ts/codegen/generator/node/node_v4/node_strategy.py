import os

from ...utils import CodeGenerationStrategy
from ....endpoint import Endpoint
from .....utils import TemplateGenerator

class NodeStrategy(CodeGenerationStrategy,
                   target='node'):

    def __init__(self, output_dir: str = 'sandbox/node'):
        super().__init__()
        self.output_dir = output_dir

        dirname = os.path.join(os.path.dirname(__file__), 'templates')
        self.template_generator = TemplateGenerator(dirname=dirname)

    def generate(self, endpoint: Endpoint):
        """

        Files to generate:
            {protocol}/EFSM.ts
            {protocol}/{role}.ts

        Returns:
            A generator of (filepath, content_to_write).
        """

        files = []
        protocol = endpoint.protocol
        role = endpoint.role
        directory = os.path.join(self.output_dir, protocol, role)

        # Generate EFSM
        files.append((os.path.join(directory, 'EFSM.ts'),
                      self.template_generator.render(path='efsm.ts.j2',
                                                     payload={'endpoint': endpoint})))

        # Generate runtime
        files.append((os.path.join(directory, 'Runtime.ts'),
                      self.template_generator.render(path='runtime.ts.j2',
                                                     payload={'endpoint': endpoint})))

        # Generate types
        files.append((os.path.join(directory, 'Utility.ts'),
                      self.template_generator.render(path='utility.ts.j2',
                                                     payload={})))

        # Generate cancellation
        files.append((os.path.join(directory, 'Cancellation.ts'),
                      self.template_generator.render(path='cancellation.ts.j2',
                                                     payload={})))

        # Generate organised exports
        files.append((os.path.join(directory, 'index.ts'),
                      self.template_generator.render(path='index.ts.j2',
                                                     payload={'endpoint': endpoint})))                       

        return files