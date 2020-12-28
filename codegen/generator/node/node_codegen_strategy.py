import os
import typing

from codegen.generator.code_generator import Artifact, CodeGenerationStrategy
from codegen.automata import Endpoint

_DEFAULT_OUTPUT_DIR = 'web-sandbox/node'
_TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')

class NodeCodegenStrategy(CodeGenerationStrategy,
                          target='node',
                          default_output=_DEFAULT_OUTPUT_DIR,
                          template_dir=_TEMPLATE_DIR):

    def get_artifacts(self, endpoint: Endpoint) -> typing.Iterable[Artifact]:

        efsm = Artifact(template='efsm.ts.j2',
                        dest='EFSM.ts',
                        payload={'endpoint': endpoint})

        session_runtime = Artifact(template='runtime.ts.j2',
                                   dest='Runtime.ts',
                                   payload={'endpoint': endpoint})
        
        utility_types = Artifact(template='utility.ts.j2',
                                 dest='Utility.ts',
                                 payload={})

        cancellation_handler = Artifact(template='cancellation.ts.j2',
                                        dest='Cancellation.ts',
                                        payload={})

        organised_exports = Artifact(template='index.ts.j2',
                                     dest='index.ts',
                                     payload={'endpoint': endpoint})
        
        yield efsm
        yield session_runtime
        yield utility_types
        yield cancellation_handler
        yield organised_exports