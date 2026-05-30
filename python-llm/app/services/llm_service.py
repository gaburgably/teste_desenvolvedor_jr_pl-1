import os
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import HumanMessage, SystemMessage


class LLMService:
    def __init__(self):
        llm = HuggingFaceEndpoint(
            repo_id="Qwen/Qwen2.5-7B-Instruct",
            provider="auto",
            huggingfacehub_api_token=os.getenv("HF_TOKEN"),
            max_new_tokens=200,
            temperature=0.5,
            top_p=0.7,
            task="conversational",
        )

        self.chat = ChatHuggingFace(llm=llm)

    def summarize_text(self, text: str, lang: str) -> str:

        messages = [
            SystemMessage(
                content=(
                    "You are a summarization assistant. "
                    "Return only the summary text, with no title, no explanation, and no JSON."
                )
            ),
            HumanMessage(
                content=f"Summarize the following text in {lang}:\n\n{text}"
            ),
        ]

        try:
            response = self.chat.invoke(messages)
            return response.content.strip()
        except Exception as e:
            raise RuntimeError(f"Erro ao resumir o texto: {str(e)}")