from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()

@dataclass
class EnvConfig:

    def require_env(self, key: str, default: str = None):
        value = os.getenv(key, default)
        if value is None:
            raise ValueError(f"{key} is not set")
        return value


settings = EnvConfig()