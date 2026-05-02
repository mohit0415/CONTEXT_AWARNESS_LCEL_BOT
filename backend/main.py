from bot.main_bot import main_bot
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from bot.main_bot import router as bot_router
from db.db_config import session
from db.db_models import Chats
from slowapi.util import get_remote_address
from slowapi import Limiter,_rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from config.env_config import settings
from db.db_config import db_engine
from db import db_models

app = FastAPI()

origins = [
    settings.require_env('ALLOWED_ORIGINS','http://localhost:5173'),   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_models.Base.metadata.create_all(bind=db_engine)


limiter = Limiter(key_func=get_remote_address)


app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)



@app.on_event("startup")
def startup_event():
    db = session()
    session_id_built_in = "103f1059-690a-4d38-85c8-aace59262293"
    chat = db.query(Chats).filter(Chats.session_id == session_id_built_in).first()

    if not chat:
        chat = Chats(
            session_id = session_id_built_in,
            chat_history=[]
        )
        db.add(chat)
        db.commit()
        db.close()
    main_bot()   # load env / validate


app.include_router(bot_router)




def main():
    print("Hello from context-awarness-lcel-bot!")
    main_bot()
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
