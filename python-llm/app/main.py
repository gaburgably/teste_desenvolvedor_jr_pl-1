import sys
from dotenv import load_dotenv

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.llm_service import LLMService

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    lang: str

@app.get("/")
def root():
    return {"message": "API is running"}

@app.post("/summarize")
async def summarize(data: TextData):
    try:
        summary = llm_service.summarize_text(data.text, data.lang)
        return {"summary": summary}
    except Exception as e:
        print("SUMMARIZE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))