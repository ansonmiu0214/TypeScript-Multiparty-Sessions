from abc import ABC, abstractmethod
import os
from pathlib import Path
import shutil
import subprocess
from sys import stdout
import typing

from codegen.automata import Endpoint
from codegen.utils import logger, TemplateGenerator

def _get_prettifier_command(*, path: str) -> typing.List[str]:
    """Generate prettifier command for the file in the specified 'path'."""
    
    return ['tsfmt', '-r', path]


Artifact = typing.NamedTuple('Artifact',
                             [('template', str), ('dest', str), ('payload', typing.Dict)])


class CodeGenerationStrategy(ABC):

    output: str

    target_to_strategy: typing.Dict[str, typing.Type['CodeGenerationStrategy']] = {}
    target_to_default_output: typing.Dict[str, str] = {}
    target_to_template_dir: typing.Dict[str, str] = {}

    def __init__(self, output: str):
        self.output = output
        
    @classmethod
    def __init_subclass__(cls, *,
                          target: str,
                          default_output: str,
                          template_dir: str):
        """Register a code generation strategy for the specified 'target'."""

        CodeGenerationStrategy.target_to_strategy[target] = cls
        CodeGenerationStrategy.target_to_default_output[target] = default_output
        CodeGenerationStrategy.target_to_template_dir[target] = template_dir
        return super().__init_subclass__()
    
    # @abstractmethod
    # def generate(self, endpoint: Endpoint) -> typing.List[typing.Tuple[str, str]]:
    #     """Produce APIs for the specified 'endpoint', specifying the files 
    #     to be created, and the exact content to be written to each file. 
        
    #     To be implemented by concrete CodeGenerationStrategy classes,
    #     as they define what files/code to generate."""
        
    #     pass
    
    @abstractmethod
    def get_artifacts(self, endpoint: Endpoint) -> typing.Iterable[Artifact]:
        pass


class CodeGenerator:

    strategy: CodeGenerationStrategy
    output_dir: str
    template_generator: TemplateGenerator
    
    def __init__(self, *, target: str, output_dir: typing.Optional[str]):

        StrategyCtor = CodeGenerationStrategy.target_to_strategy.get(target)
        if StrategyCtor is None:
            raise ValueError(f'Unsupported target: "{target}"')

        output_dir = output_dir if output_dir is not None else \
                        CodeGenerationStrategy.target_to_default_output[target]

        template_dir = CodeGenerationStrategy.target_to_template_dir[target]

        self.strategy = StrategyCtor(output_dir)
        self.output_dir = output_dir
        self.template_generator = TemplateGenerator(dirname=template_dir)

    def generate(self, endpoint: Endpoint) -> int:
        """Generate APIs for the specified 'endpoint' and write the changes to file.
        Return the exit code."""

        protocol = endpoint.protocol
        role = endpoint.role
        directory = os.path.join(self.output_dir, protocol, role)

        # Generate code in memory, to guarantee atomic writes.
        artifacts = [(os.path.join(directory, dest), self.template_generator.render(path=template, payload=payload))
                     for template, dest, payload in self.strategy.get_artifacts(endpoint)]

        # Cleanup existing generated code in file system.
        directories = set(os.path.dirname(filename) for filename, _ in artifacts)
        for directory in directories:
            if os.path.exists(directory):
                shutil.rmtree(directory)
            
            os.makedirs(directory)

        for filename, content in artifacts:
            Path(filename).write_text(content)

            # Pipe through code prettifier.
            phase = f'Generate {filename}'
            completion = subprocess.run(_get_prettifier_command(path=filename), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            exit_code = completion.returncode
            if exit_code != 0:
                logger.FAIL(phase)
                return exit_code

            logger.SUCCESS(phase)
        
        return 0