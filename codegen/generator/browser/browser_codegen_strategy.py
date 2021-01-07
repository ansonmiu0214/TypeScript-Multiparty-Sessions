import os
import typing

from codegen.automata.endpoint import Endpoint
from codegen.generator.code_generator import Artifact, CodeGenerationStrategy

_DEFAULT_OUTPUT_DIR = 'web-sandbox/browser'
_TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')

class BrowserCodegenStrategy(CodeGenerationStrategy,
                             target='browser',
                             default_output=_DEFAULT_OUTPUT_DIR,
                             template_dir=_TEMPLATE_DIR):

    def get_artifacts(self, endpoint: Endpoint) -> typing.Iterable[Artifact]:

        role = endpoint.role

        runtime_types = Artifact(template='session.ts.j2',
                                 dest='Session.ts',
                                 payload={})

        message_interface = Artifact(template='message.ts.j2',
                                     dest='Message.ts',
                                     payload={})

        utilty_types = Artifact(template='types.ts.j2',
                                dest='Types.ts',
                                payload={})

        roles = Artifact(template='roles.ts.j2',
                         dest='Roles.ts',
                         payload={'endpoint': endpoint})

        cancellation_handler = Artifact(template='cancellation.ts.j2',
                                        dest='Cancellation.ts',
                                        payload={})

        efsm = Artifact(template='efsm.ts.j2',
                        dest='EFSM.ts',
                        payload={'endpoint': endpoint})

        session_runtime = Artifact(template='runtime.tsx.j2',
                                   dest=f'{role}.tsx',
                                   payload={'endpoint': endpoint})

        states = []
        for state in endpoint.efsm.send_states:
            states.append(Artifact(template='send_component.tsx.j2',
                                   dest=f'S{state.id}.tsx',
                                   payload={'endpoint': endpoint, 'state': state}))

        for state in endpoint.efsm.receive_states:
            states.append(Artifact(template='receive_component.tsx.j2',
                                   dest=f'S{state.id}.tsx',
                                   payload={'endpoint': endpoint, 'state': state}))

        if endpoint.efsm.has_terminal_state():
            states.append(Artifact(template='terminal_component.tsx.j2',
                                   dest=f'S{endpoint.efsm.terminal_state.id}.tsx',
                                   payload={'state': endpoint.efsm.terminal_state}))

        organised_exports = Artifact(template='index.ts.j2',
                                     dest='index.ts',
                                     payload={'endpoint': endpoint})

        yield runtime_types
        yield message_interface
        yield utilty_types
        yield roles
        yield cancellation_handler
        yield efsm
        yield session_runtime
        yield from states
        yield organised_exports