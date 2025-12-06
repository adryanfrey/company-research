from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.apis.research import router as research_router

app = FastAPI()

# Configure CORS to allow requests from React
# Not secure, but sufficient for this assignment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    research_router,
    prefix="/api/research",
    tags=["Research"],
)
