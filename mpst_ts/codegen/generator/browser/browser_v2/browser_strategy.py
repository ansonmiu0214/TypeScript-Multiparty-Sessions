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

        as_path = lambda filename: os.path.join(self.output_dir, protocol, role, filename)

        # Generate Session
        files.append((as_path('Session.ts'),
                     self.template_generator.render(path='session.ts.j2',
                                                    payload={})))

        # Generate Messages interface
        files.append((as_path('Message.ts'),
                     self.template_generator.render(path='message.ts.j2',
                                                    payload={})))

        # Generate utility types
        files.append((as_path('Types.ts'),
                     self.template_generator.render(path='types.ts.j2',
                                                    payload={})))

        # Generate roles
        files.append((as_path('Roles.ts'),
                     self.template_generator.render(path='roles.ts.j2',
                                                    payload={'endpoint': endpoint})))

        # Generate cancellation enums
        files.append((as_path('Cancellation.ts'),
                     self.template_generator.render(path='cancellation.ts.j2',
                                                    payload={})))

        # Generate EFSM
        files.append((as_path('EFSM.ts'),
                     self.template_generator.render(path='efsm.ts.j2',
                                                    payload={'endpoint': endpoint})))

        # Generate runtime
        files.append((as_path(f'{role}.tsx'),
                      self.template_generator.render(path='runtime.tsx.j2',
                                                     payload={'endpoint': endpoint})))
        # Generate states
        for state in endpoint.efsm.send_states:
            files.append((as_path(f'S{state.id}.tsx'),
                          self.template_generator.render(path='send_component.tsx.j2',
                                                         payload={'endpoint': endpoint,
                                                                  'state': state})))

        for state in endpoint.efsm.receive_states:
            files.append((as_path(f'S{state.id}.tsx'),
                          self.template_generator.render(path='receive_component.tsx.j2',
                                                         payload={'endpoint': endpoint,
                                                                  'state': state})))

        if endpoint.efsm.has_terminal_state():
            files.append((as_path(f'S{endpoint.efsm.terminal_state}.tsx'),
                          self.template_generator.render(path='terminal_component.tsx.j2',
                                                         payload={'state': endpoint.efsm.terminal_state})))

        # Generate organised exports
        files.append((as_path('index.ts'),
                      self.template_generator.render(path='index.role.ts.j2',
                                                     payload={'endpoint': endpoint})))

        return files