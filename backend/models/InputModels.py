from pydantic import BaseModel

class ChatInput(BaseModel):
    query : str
    session_id : str

class ChatHistory(BaseModel):
    session_id : str