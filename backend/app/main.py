from fastapi import FastAPI

app = FastAPI(
    title="Preflight API",
    version="0.1.0",
)


@app.get("/")
def root():
    return {"message": "Welcome to Preflight 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}