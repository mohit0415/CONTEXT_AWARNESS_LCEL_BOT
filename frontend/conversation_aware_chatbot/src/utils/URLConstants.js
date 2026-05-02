// const baseURL = 'http://localhost:8000'
const baseURL = import.meta.env.VITE_BACKEND_URL

export const fetchSessions = baseURL + '/fetchSession'

export const genId = baseURL + '/new-session'

export const chat = baseURL + '/chat'

export const historyChat = baseURL + '/history'

export const download = baseURL + '/download'