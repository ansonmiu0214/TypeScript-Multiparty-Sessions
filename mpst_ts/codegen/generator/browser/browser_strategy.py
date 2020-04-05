import os

from ..utils import CodeGenerationStrategy
from ...EFSM import EFSM
from ....utils import TemplateGenerator

class BrowserStrategy(CodeGenerationStrategy,
                      target='browser'):

    def __init__(self):
        super().__init__()
        self.output_dir = 'sandbox/browser'

        dirname = os.path.join(os.path.dirname(__file__), 'templates')
        self.template_generator = TemplateGenerator(dirname=dirname)

    def generate(self, efsm: EFSM):
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
        protocol = efsm.metadata['protocol']
        role = efsm.metadata['role']

        # Generate EFSM
        files.append((os.path.join(self.output_dir, protocol, 'EFSM.ts'),
                     self.template_generator.render(path='EFSM.ts.j2',
                                                    payload={'efsm': efsm})))

        # Generate Session
        files.append((os.path.join(self.output_dir, protocol, 'Session.tsx'),
                     self.template_generator.render(path='Session.tsx',
                                                    payload={})))

        # Generate runtime
        files.append((os.path.join(self.output_dir, protocol, role, f'{role}.tsx'),
                      self.template_generator.render(path='runtime.tsx.j2',
                                                    payload={'efsm': efsm})))

        # Generate states
        for state in efsm.send_states.values():
            files.append((os.path.join(self.output_dir, protocol, role, f'S{state.id}.tsx'),
                          self.template_generator.render(path='send_component.tsx.j2',
                                                    payload={'efsm': efsm,
                                                             'state': state})))

        for state in efsm.receive_states.values():
            files.append((os.path.join(self.output_dir, protocol, role, f'S{state.id}.tsx'),
                          self.template_generator.render(path='receive_component.tsx.j2',
                                                    payload={'efsm': efsm,
                                                             'state': state})))

        if efsm.has_terminal_state():
            files.append((os.path.join(self.output_dir, protocol, role, f'S{efsm.terminal_state}.tsx'),
                          self.template_generator.render(path='terminal_component.tsx.j2',
                                                         payload={'state': efsm.terminal_state})))

        return files