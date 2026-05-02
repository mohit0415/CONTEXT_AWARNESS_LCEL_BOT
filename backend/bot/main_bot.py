from config.env_config import settings
from fastapi.routing import APIRouter
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda,RunnableBranch
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from models.InputModels import ChatInput,ChatHistory
from db import db_models
from db.db_models import Chats
from db.db_config import db_engine,session
import uuid
from fastapi import FastAPI,HTTPException,Request
from typing import List
import os
from fastapi.responses import FileResponse
import json
from langchain.agents import create_agent
from tools.location_tools import get_destination_info,get_user_location
from langchain_groq import ChatGroq
from slowapi.util import get_remote_address
from slowapi import Limiter,_rate_limit_exceeded_handler
from config.env_config import settings
from config.limiter_config import limiter

router = APIRouter()






def missing_env(api_key,model_name,base_url):
    if not model_name:
        raise ValueError("GEMINI_MODEL_NAME is not set. Please configure it in your .env file.")
    if not base_url:
        raise ValueError("GEMINI_BASE_URL is not set. Please configure it in your .env file.")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set. Please configure it in your .env file.")


def main_bot():
    api_key = settings.require_env("GEMINI_API_KEY","")
    model_name = settings.require_env("GEMINI_MODEL_NAME","gemini-2.5-flash-lite")
    base_url = settings.require_env("GEMINI_BASE_URL","https://generativelanguage.googleapis.com/v1beta/openai/")

    api_key_groq = settings.require_env("GROQ_API_KEY","")
    model_name_groq = settings.require_env("GROQ_MODEL_NAME","gemini-2.5-flash-lite")
    base_url_groq= "groq"


    missing_env(api_key=api_key_groq,model_name=model_name_groq,base_url=base_url_groq)


llms = ChatOpenAI(
    api_key=settings.require_env("GEMINI_API_KEY",""),
    model=settings.require_env("GEMINI_MODEL_NAME","gemini-2.5-flash-lite"),
    base_url=settings.require_env("GEMINI_BASE_URL","https://generativelanguage.googleapis.com/v1beta/openai/")
)

llm = ChatGroq(
    temperature=0.4,
    model=settings.require_env("GROQ_MODEL_NAME","gemini-2.5-flash-lite"),
    api_key=settings.require_env("GROQ_API_KEY",""),
)

prompt = ChatPromptTemplate.from_messages([
    ("system","You are a Classifier of the given prompt.\n"
    "Just give the answer in one single word."
    "Classify the prompt into one of the given two categories:\n"
    "-TECHNICAL:If the User's Query is more about dealing with the Technical issues like about his electronic device or anything related to that\n"
    "-GENERAL:If the User's Query is more about self oreinted about his personal details.\n"
    "-LOCATION_QUERY: queries that depend on real-time-location or recently updated information such as loaction in terms of city,country,etc. These queries typically require current location search tools to retrieve the most current and reliable live location before responding."
    "Finally,Give the answer in one single word which is either TECHNICAL or GENERAL or CURRENT_AFFAIRS after classifiaction based on above criteria."),
    ("user","{query}")
])

classifier_prompt_chain = prompt | llm | StrOutputParser()

#Condition function
def classisfy_prompt(input_type : dict) -> bool:
    classification : str = input_type.get('classification')
    if classification.strip().upper() == 'TECHNICAL':
        return True
    else:
        return False
    
def classisfy_prmt_general(input_type : dict) -> bool:
    classification : str = input_type.get('classification')
    if classification.strip().upper() == 'GENERAL':
        return True
    else:
        return False

techinal_prompt = ChatPromptTemplate.from_messages([
    ('system',"You are Technical Assistant.\n"
    "Respond to the User about the techinal aspects of the query-oriented details to a moderate length of the response."),
    MessagesPlaceholder(variable_name='chat_history'),
    ('user',"Query : {original_query}")
])

techinal_chain = techinal_prompt | llm | StrOutputParser()


general_prompt = ChatPromptTemplate.from_messages([
    ('system',"You are Friendly and Personal Assistant.\n"
    "Respond to the User about the personal aspects of the query-oriented details to a moderate length of the response.\n"
    "If the current query from user relates to the past conversation chat history remember it and answer the question from previous chat history if required."),
    MessagesPlaceholder(variable_name='chat_history'),
    ('user',"Query : {original_query}")
])

general_chain = general_prompt | llm | StrOutputParser()

location_prompt = ChatPromptTemplate.from_messages([
    ('system','You are a Loaction Finder Tool Assistant.\n'
    "Respond to the User about the given real-time-location query who's information might have updated recently or maybe not\n"
    "Finally, find the location accurately"),
    MessagesPlaceholder(variable_name='chat_history'),
    ('user',"Query : {original_query}")
])

tools = [get_user_location]


agent_prompt =  """You are a helpful location finding assistant.

        When users ask about their current location:
        - Call get_user_location to get the user's city/region/country

        When users ask about his/her location:
        - FIRST: Call get_user_location to get the user's city/region/country
        - THEN:Provide a structured Loaction Message in readable and understandable paragraph"""

agent =create_agent(
    model=llm,
    tools=tools,
    system_prompt=agent_prompt,
    debug=True
)


loc_prompt = ChatPromptTemplate.from_messages([
    ('system',"You are a Loaction Generation Summarizer\n"
    "Remember the Location of the User from the past chat history..\n"),
    MessagesPlaceholder(variable_name='chat_history'),
    ('user' , 'orginal_query : {original_query}')
])

# def parse_json(strs: str):
#     if not strs:
#         return {}
#     try:
#         return json.loads(strs)
#     except Exception:
#         return {}

# parsing_json_obj = RunnableLambda(parse_json)

# ai_agent_chain_basic = loc_prompt | agent 

def modify_prompt(result : str):
    prompt_modify = ChatPromptTemplate.from_messages([
        ('system',"You are a Location Finder Who Summarizes well.\n"
        "You are given A JSON string.\n"
        "You need to convert this JSON string into a clean readable summary.\n"
        "So here is the JSON String:{result}. SO Extract the location of the user from this JSON string and summarize it well in a medium size paragraph.")
    ])

    formatted_messages = prompt_modify.format_messages(
        result=result
    )

    return formatted_messages


new_prompt = RunnableLambda(modify_prompt)

# Replace the ai_agent_chain_basic and related code with:

def handle_location_query(input_dict: dict) -> str:
    """Handle location-based queries using the agent"""
    query = input_dict.get('original_query', '')
    
    try:
        result = agent.invoke(
            {"messages": [
                {"role": "user", "content": query}
                ]
            }
            )
        response = result['messages'][-1].content
        return str(response)
    except Exception as e:
        return f"Error processing location query: {str(e)}"

ai_agent_chain = RunnableLambda(handle_location_query)

# ai_agent_chain = ai_agent_chain_basic | new_prompt | llm | StrOutputParser()



# # Replace the ai_agent_chain with a simpler approach
# def handle_location_query(input_dict: dict) -> str:
#     """Handle location-based queries using the agent"""
#     query = input_dict.get('original_query', '')
#     chat_history = input_dict.get('chat_history', [])
    
#     # Invoke the agent directly
#     agent_response = agent.invoke({
#         "messages": [{"role": "user", "content": query}]
#     })
    
#     # Extract the agent's response
#     if isinstance(agent_response, dict) and 'output' in agent_response:
#         return agent_response['output']
#     elif isinstance(agent_response, dict) and 'messages' in agent_response:
#         # Get the last message content
#         messages = agent_response['messages']
#         if messages:
#             last_message = messages[-1]
#             if hasattr(last_message, 'content'):
#                 return last_message.content
#             elif isinstance(last_message, dict):
#                 return last_message.get('content', str(agent_response))
    
#     return str(agent_response)

# ai_agent_chain = RunnableLambda(handle_location_query)

branch_decider = RunnableBranch(
    (classisfy_prompt,techinal_chain),
    (classisfy_prmt_general,general_chain),
    ai_agent_chain
)


# Orchestration
def input_orchestrator(input_dict : dict) -> dict:
    classification = classifier_prompt_chain.invoke({
        'query': input_dict['query']
    })
    chat_history = input_dict.get("chat_history", [])
    return {
        'classification' : classification,
        'original_query': input_dict["query"],
        'chat_history': chat_history
    }
orchestartor_LCEL = RunnableLambda(input_orchestrator)



#Final LCEL CHAIN
full_chain = orchestartor_LCEL | branch_decider





def serialize_history(history: InMemoryChatMessageHistory):
    return [
        {
            "role": msg.type,
            "content": msg.content
        }
        for msg in history.messages
    ]

def deserialize_history(data):
    history = InMemoryChatMessageHistory()

    for msg in data:
        if msg["role"] == "human":
            history.add_user_message(msg["content"])
        elif msg["role"] == "ai":
            history.add_ai_message(msg["content"])

    return history


store ={}

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    if session_id in store:
        return store[session_id]

    db = session()
    chat = db.query(Chats).filter(Chats.session_id == session_id).first()

    if chat and chat.chat_history:
        history = deserialize_history(chat.chat_history)
    else:
        history = InMemoryChatMessageHistory()

    store[session_id] = history
    db.close()
    return history 
    
    

stateful_chain = RunnableWithMessageHistory(
    runnable=full_chain,
    get_session_history=get_session_history,
    input_messages_key='query',
    history_messages_key='chat_history'
)


@router.get("/new-session")
def new_session():
    """Generate a new chat session ID."""
    db = session()
    new_session_id = str(uuid.uuid4())

    new_chat = Chats(
        session_id= new_session_id,
        chat_history=[]
    )

    db.add(new_chat)
    db.commit()
    db.close()

    return {"session_id": new_session_id}



@router.post("/chat")
@limiter.limit(lambda: f"{settings.require_env('RATE_LIMIT_PER_HOUR', '15')}/hour")
def chat_with_agent(request : Request,payload: ChatInput):
    """Chat endpoint maintaining conversation memory per session."""

    print(f"User IP identified: {request.client.host}", flush=True)

    db= session()

    response = stateful_chain.invoke(
        {"query": payload.query},
        config={"configurable": {"session_id": payload.session_id}}
    )

    # history = get_session_history(payload.session_id)

    history = get_session_history(payload.session_id)

    chat = db.query(Chats).filter(Chats.session_id == payload.session_id).first()

    if not chat:
        chat = Chats(session_id=payload.session_id, chat_history=[])
        db.add(chat)
    
    chat.chat_history = []
    chat.chat_history.extend(serialize_history(history=history))  

    db.commit()
    db.close()



    return {
        "session_id": payload.session_id,
        "user_input": payload.query,    
        "agent_response": response
    }

@router.post('/history')
def get_chat_history(input_history : ChatHistory):
    db = session()

    history = db.query(Chats).filter(Chats.session_id == input_history.session_id).first()

    if not history:
        raise HTTPException(
            status_code=404,
            detail=f'No session Id exists with Id: {input_history.session_id}'
        )
    

    db.close()
    
    return {
        'chat_history' : history.chat_history
    }

@router.get('/fetchSession')
def fetch_session():
    db = session()

    all_users = db.query(Chats).all()

    db.close()

    list_of_users =  [
        {
            'session_id' : user.session_id
        }
        for user in all_users
    ]

    return {
        'detail' : list_of_users
    }

@router.post("/download")
def download_json(session_dict : ChatHistory):
    data = {
        "name": "Mohit",
        "role": "developer",
        "project": "chatbot"
    }

    db = session()

    chat = db.query(Chats).filter(Chats.session_id == session_dict.session_id).first()

    if not chat:
        raise HTTPException(
            status_code=404,
            detail='No Session ID in DB'
        )
    
    datas = chat.chat_history


    file_path = "files/chart_history.json"

    # ensure folder exists
    os.makedirs("files", exist_ok=True)

    # write JSON to file
    with open(file_path, "w") as f:
        json.dump(datas, f, indent=4)

    return FileResponse(
        path=file_path,
        filename="chart_history.json",
        media_type="application/json"
    )




@router.get("/test")
@limiter.limit("5/minute")
async def test_route(request: Request):
    print(f"User IP identified: {request.client.host}", flush=True)
    return {"ip": request.client.host, "message": "You are being tracked by your real IP!"}




