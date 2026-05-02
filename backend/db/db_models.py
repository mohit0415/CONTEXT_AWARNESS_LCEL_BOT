from sqlalchemy.ext.declarative import declarative_base 
from sqlalchemy import Column,Integer,String,Float,DateTime,JSON
from datetime import datetime
from sqlalchemy.ext.mutable import MutableList

Base = declarative_base()


class Chats(Base):

    __tablename__ = 'chats'

    id = Column(Integer,primary_key=True,autoincrement=True,index=True)
    session_id = Column(String,nullable=False)
    chat_history = Column(MutableList.as_mutable(JSON),default=list)
    created_at = Column(DateTime,nullable=False,default=datetime.now)