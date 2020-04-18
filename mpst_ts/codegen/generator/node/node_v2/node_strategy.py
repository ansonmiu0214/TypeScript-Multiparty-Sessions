import os

from ...utils import CodeGenerationStrategy
from ....endpoint import Endpoint
from .....utils import TemplateGenerator

class NodeStrategy(CodeGenerationStrategy,
                   target='node'):

    def __init__(self):
        super().__init__()
        self.output_dir = 'sandbox/node'

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

        # Generate EFSM
        files.append((os.path.join(self.output_dir, protocol, 'EFSM.ts'),
                      self.template_generator.render(path='efsm.ts.j2',
                                                     payload={'endpoint': endpoint})))

        # Generate modules for send states
        for state in endpoint.efsm.send_states:
            files.append((os.path.join(self.output_dir, protocol, f'S{state}.ts'),
                      self.template_generator.render(path='send_module.ts.j2',
                                                     payload={'endpoint': endpoint,
                                                              'state': state})))

        # Generate modules for receive states
        for state in endpoint.efsm.receive_states:
            files.append((os.path.join(self.output_dir, protocol, f'S{state}.ts'),
                      self.template_generator.render(path='receive_module.ts.j2',
                                                     payload={'endpoint': endpoint,
                                                              'state': state})))

        # Generate runtime
        files.append((os.path.join(self.output_dir, protocol, f'{role}.ts'),
                      self.template_generator.render(path='runtime.ts.j2',
                                                     payload={'endpoint': endpoint})))

        # Generate session
        files.append((os.path.join(self.output_dir, protocol, 'Session.ts'),
                      self.template_generator.render(path='Session.ts',
                                                     payload={})))

        return files