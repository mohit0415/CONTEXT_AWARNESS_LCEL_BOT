from slowapi import Limiter
from slowapi.util import get_remote_address

# Create ONE instance to be shared across the whole project

from fastapi import Request

# def get_real_ip(request: Request) -> str:
#     """
#     Specifically designed for platforms like Render/Cloudflare.
#     Grabs the original user IP from the X-Forwarded-For header.
#     """
#     forwarded = request.headers.get("X-Forwarded-For")
#     if forwarded:
#         # X-Forwarded-For can be a list: "user_ip, proxy1_ip, proxy2_ip"
#         # The first one is always the client.
#         return forwarded.split(",")[0].strip()
    
#     # Fallback if header is missing
#     return request.client.host if request.client else "127.0.0.1"

def get_user_key(request: Request):
    """
    Rate limit key function - uses user_id from state, falls back to IP
    """
    user_id = getattr(request.state, "user_id", None)
    
    if user_id:
        print(f'[RATE_LIMIT] Using user_id: {user_id}', flush=True)
        return f"user:{user_id}"
    
    # Fallback to IP address if no user_id
    ip = get_remote_address(request)
    print(f'[RATE_LIMIT] Using IP fallback: {ip}', flush=True)
    return f"ip:{ip}"

# Initialize your limiter with the custom function
limiter = Limiter(key_func=get_user_key)