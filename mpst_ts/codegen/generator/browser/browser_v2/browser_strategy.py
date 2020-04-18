import os

from ...utils import CodeGenerationStrategy
from ....endpoint import Endpoint
from .....utils import TemplateGenerator

class BrowserStrategy(CodeGenerationStrategy,
                      target='browser'):

    def __init__(self, output_dir: str = 'sandbox/browser'):
        super().__init__()
        self.output_dir = output_dir

        dirname = os.path.join(os.path.dirname(__file__), 'templates')
        self.template_generator = TemplateGenerator(dirname=dirname)

    def generate(self, endpoint: Endpoint):
        """

        Files to generate:
            {protocol}/Session.ts
            {protocol}/EFSM.ts
            {protocol}/{role}/{role}.tsx

            for state in efsm.states:
                {protocol}/{role}/S{state}.tsx

        Returns:
            A generator of (filepath, content_to_write).
        """

        files = []
        protocol = endpoint.protocol
        role = endpoint.role

        # Generate Session
        files.append((os.path.join(self.output_dir, protocol, role, 'Session.ts'),
                     self.template_generator.render(path='Session.ts',
                                                    payload={})))
        # Generate EFSM
        files.append((os.path.join(self.output_dir, protocol, role, 'EFSM.ts'),
                     self.template_generator.render(path='EFSM.ts.j2',
                                                    payload={'endpoint': endpoint})))

        # Generate runtime
        files.append((os.path.join(self.output_dir, protocol, role, f'{role}.tsx'),
                      self.template_generator.render(path='runtime.tsx.j2',
                                                    payload={'endpoint': endpoint})))

        # Generate states
        for state in endpoint.efsm.send_states:
            files.append((os.path.join(self.output_dir, protocol, role, f'S{state.id}.tsx'),
                          self.template_generator.render(path='send_component.tsx.j2',
                                                    payload={'endpoint': endpoint,
                                                             'state': state})))

        for state in endpoint.efsm.receive_states:
            files.append((os.path.join(self.output_dir, protocol, role, f'S{state.id}.tsx'),
                          self.template_generator.render(path='receive_component.tsx.j2',
                                                    payload={'endpoint': endpoint,
                                                             'state': state})))

        if endpoint.efsm.has_terminal_state():
            files.append((os.path.join(self.output_dir, protocol, role, f'S{endpoint.efsm.terminal_state}.tsx'),
                          self.template_generator.render(path='terminal_component.tsx.j2',
                                                         payload={'state': endpoint.efsm.terminal_state})))

        return files