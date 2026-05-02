from db.db_config import session

def db_help():
    db  = session()
    try:
        yield db
    finally:
        db.close()