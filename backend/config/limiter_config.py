from slowapi import Limiter
from slowapi.util import get_remote_address

# Create ONE instance to be shared across the whole project
limiter = Limiter(key_func=get_remote_address)