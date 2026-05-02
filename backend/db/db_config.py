from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from config.env_config import settings


db_url = settings.require_env('DB_URL','')
db_engine = create_engine(db_url)
session = sessionmaker(autoflush=False,bind=db_engine)
