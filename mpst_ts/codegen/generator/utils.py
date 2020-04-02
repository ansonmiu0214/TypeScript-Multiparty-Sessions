from abc import ABC, abstractmethod
import os
import subprocess

from ..EFSM import EFSM

class CodeGenerationStrategy(ABC):

    target_to_strategy = {}

    def __init__(self):
        super().__init__()

    @classmethod
    def __init_subclass__(cls, *, target):
        CodeGenerationStrategy.target_to_strategy[target] = cls
        return super().__init_subclass__()
    
    @abstractmethod
    def generate(self, efsm: EFSM):
        pass

class CodeGenerator:

    def __init__(self, *, target):
        self.strategy = CodeGenerationStrategy.target_to_strategy[target]()

    def generate(self, efsm: EFSM):
        files_to_generate = self.strategy.generate(efsm)
        for path, content in files_to_generate:
            # Create directory if not already exists
            dir_ = os.path.dirname(path)
            os.makedirs(dir_, exist_ok=True)

            # Write content to file
            with open(path, 'w') as file_:
                file_.write(content)

            # Pipe through code prettifier
            subprocess.run(['tsfmt', '-r', path])