# Context Awareness Bot

A Full Stack Conversational AI Platform

## Project Description

Context Awareness Bot is a full stack portfolio project that demonstrates advanced conversational AI capabilities. The system leverages FastAPI for the backend, React (with Vite) for the frontend, and integrates cutting-edge AI frameworks such as LangChain, custom tools, agents, LCEL chains, and LCEL routers. The bot is designed to provide context-aware, dynamic, and intelligent responses, making it suitable for a variety of real-world applications such as customer support, virtual assistants, and knowledge retrieval.

## Features
- **Conversational AI**: Context-aware chatbot with memory and dynamic response generation
- **LangChain Integration**: Utilizes LangChain for chaining LLM calls, tool usage, and agent orchestration
- **Custom Tools & Agents**: Extendable with custom tools and agent logic for specialized tasks
- **LCEL Chains & Routers**: Modular and scalable conversation flows using LCEL chains and routers
- **Modern Frontend**: Responsive React UI for seamless user experience
- **Backend API**: FastAPI-based backend for high performance and easy extensibility
- **Session & History Management**: Tracks user sessions and chat history

## Tech Stack
- **Frontend**: React, Vite, JavaScript, CSS
- **Backend**: FastAPI, Python
- **AI/LLM Frameworks**: LangChain, LCEL (chains, routers, agents)
- **Database**: (Configurable, e.g., SQLite/PostgreSQL)
- **Other**: Custom tools, REST APIs

## Project Structure

```
backend/
  main.py                # FastAPI entry point
  requirements.txt       # Python dependencies
  pyproject.toml         # Project metadata
  bot/
    main_bot.py          # Main bot logic (LangChain, agents, tools)
  config/
    env_config.py        # Environment configs
    limiter_config.py    # Rate limiting configs
  db/
    db_config.py         # DB connection setup
    db_helper.py         # DB utility functions
    db_models.py         # ORM models
  files/
    chart_history.json   # Chat history storage
  models/
    InputModels.py       # Pydantic models for API
  tools/
    location_tools.py    # Example custom tool
  utils/
    middleware_session.py# Session middleware

frontend/conversation_aware_chatbot/
  src/
    App.jsx              # Main React app
    components/          # UI components (ChatBot, ChatInput, etc.)
    data/                # Sample and string data
    store/               # Redux store and reducers
    utils/               # Network and URL utilities
  public/                # Static assets
  package.json           # Frontend dependencies
  vite.config.js         # Vite config
```

## Getting Started

### Backend Setup
1. Navigate to `backend/`
2. (Recommended) Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to `frontend/conversation_aware_chatbot/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Accessing the App
- Frontend: production -> [https://mohit-context-awarness-lcel-bot.vercel.app/] | local->(http://localhost:5173)
- Backend API: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## Customization & Extensibility
- Add new tools/agents in `backend/bot/` and `backend/tools/`
- Define new chains/routers using LCEL in `backend/bot/`
- Extend frontend UI in `frontend/conversation_aware_chatbot/src/components/`

## License
This project is for portfolio and educational purposes.
