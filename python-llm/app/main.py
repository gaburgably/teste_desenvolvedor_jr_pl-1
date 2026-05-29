import sys
from dotenv import load_dotenv

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI
from pydantic import BaseModel
from services.llm_service import LLMService

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str


@app.post("/summarize")
async def summarize(data: TextData):
    text = data.text
    llm_service.summarize_text(text)
    return "OK"
