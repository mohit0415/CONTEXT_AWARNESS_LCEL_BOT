from uuid import uuid4
from fastapi import Request

async def session_middleware(request: Request, call_next):
    user_id = request.cookies.get("uid")

    if not user_id:
        user_id = str(uuid4())
        print(f'[SESSION] Created new user_id: {user_id}', flush=True)

    request.state.user_id = user_id

    response = await call_next(request)

    response.set_cookie(
        key="uid",
        value=user_id,
        httponly=True,
        secure=True,  # Set to True if using HTTPS
        samesite="lax",  # Important for cross-origin requests
        path="/",  # Available for all routes
        max_age=30*24*60*60  # 30 days
    )
    print(f'[SESSION] Cookie set for user_id: {user_id}', flush=True)

    return response