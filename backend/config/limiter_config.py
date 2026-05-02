from slowapi import Limiter
from slowapi.util import get_remote_address

# Create ONE instance to be shared across the whole project

from fastapi import Request
from slowapi import Limiter

def get_real_ip(request: Request) -> str:
    """
    Specifically designed for platforms like Render/Cloudflare.
    Grabs the original user IP from the X-Forwarded-For header.
    """
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # X-Forwarded-For can be a list: "user_ip, proxy1_ip, proxy2_ip"
        # The first one is always the client.
        return forwarded.split(",")[0].strip()
    
    # Fallback if header is missing
    return request.client.host if request.client else "127.0.0.1"

# Initialize your limiter with the custom function
limiter = Limiter(key_func=get_real_ip)