from abc import ABC, abstractmethod
import os
import shutil
import subprocess
import typing

from ..endpoint import Endpoint

class CodeGenerationStrategy(ABC):

    target_to_strategy = {}

    def __init__(self):
        super().__init__()

    @classmethod
    def __init_subclass__(cls, *, target):
        CodeGenerationStrategy.target_to_strategy[target] = cls
        return super().__init_subclass__()
    
    @abstractmethod
    def generate(self, endpoint: Endpoint):
        pass

class CodeGenerator:

    def __init__(self, *, target, output_dir: typing.Optional[str]):
        if output_dir is not None:
            self.strategy = CodeGenerationStrategy.target_to_strategy[target](output_dir)
        else:
            self.strategy = CodeGenerationStrategy.target_to_strategy[target]()

    def generate(self, endpoint: Endpoint):
        files_to_generate = self.strategy.generate(endpoint)

        dirs = set(os.path.dirname(path) for path, _ in files_to_generate)
        for dir_ in dirs:
            if os.path.exists(dir_):
                # Delete directory if already exists
                shutil.rmtree(dir_)
            
            os.makedirs(dir_)

        for path, content in files_to_generate:
            # Write content to file
            with open(path, 'w') as file_:
                file_.write(content)

            # Pipe through code prettifier
            subprocess.run(['tsfmt', '-r', path])