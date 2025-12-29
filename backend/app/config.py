from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    database_url: str
    cors_origins: str = "" 

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

settings = Settings()