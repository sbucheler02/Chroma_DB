from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from langchain_text_splitters import RecursiveCharacterTextSplitter

with open("sample.txt", "r") as f:
    text = f.read()

splitter = RecursiveCharacterTextSplitter(
    chunk_size = 200,
    chunk_overlap = 20
)

result = splitter.split_text(text)

chunk_data = [{"text": chunk, "length": len(chunk)} for chunk in result]

app = FastAPI()


@app.get("/chunks")
def get_chunks():
    return {"chunks": chunk_data}

app.mount("/", StaticFiles(directory="static", html=True), name="static")