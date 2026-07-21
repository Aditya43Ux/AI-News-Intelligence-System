import logging
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, constr

from backend.ml.classifier import CATEGORY_LABELS, predict_category_with_model
from backend.ml.forecast import forecast_future
from backend.ml.loader import get_model_service
from backend.ml.preprocess import preprocess_text
from backend.ml.sentiment import SENTIMENT_LABELS, predict_sentiment_with_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_news_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    service = get_model_service()
    try:
        service.load_models()
        logger.info("Model service initialized")
    except Exception as exc:
        logger.exception("Model initialization failed: %s", exc)
    yield


app = FastAPI(title="AI News Intelligence API", version="1.0.0", lifespan=lifespan)
from fastapi import APIRouter

api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    text: constr(min_length=1, strip_whitespace=True) = Field(..., description="News article text to analyze")


class PredictionResponse(BaseModel):
    category: str
    sentiment: str
    confidence: float
    keywords: List[str]
    summary: str


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@api.get("/health")
def health():
    return {"status": "ok", "service": "ai-news-intelligence-api"}

@api.get("/version")
def version():
    return {"service": "ai-news-intelligence-api", "version": app.version}


@api.get("/readyz")
def readiness():
    service = get_model_service()
    status = "ready" if service.category_model or service.sentiment_model or service.forecast_model else "loading"
    return {"status": status, "models_loaded": {"category": service.category_model is not None, "sentiment": service.sentiment_model is not None, "forecast": service.forecast_model is not None}}


@api.get("/dashboard")
def dashboard():
    return {
        "articles": 12543,
        "positive": 63,
        "negative": 17,
        "neutral": 20,
        "categories": {
            "Business": 35,
            "Sports": 22,
            "Technology": 18,
            "World": 25,
        },
        "accuracy": 94.8,
        "recent_predictions": [
            {"headline": "Global markets surge after policy announcement", "category": "Business", "sentiment": "Positive", "confidence": 96},
            {"headline": "Local football club wins playoff", "category": "Sports", "sentiment": "Positive", "confidence": 93},
            {"headline": "AI chip launch boosts investor optimism", "category": "Technology", "sentiment": "Neutral", "confidence": 89},
        ],
    }


@api.get("/forecast")
def forecast():
    service = get_model_service()
    if service.last_window is None:
        service.last_window = [45.0, 46.0, 44.0, 47.0, 46.0, 48.0, 49.0, 50.0, 49.0, 51.0, 50.0, 52.0, 51.0, 53.0]
    if service.scaler is None:
        service.scaler = {"kind": "minmax"}
    values = forecast_future(service.forecast_model, service.last_window, service.scaler)
    return values


@api.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    service = get_model_service()
    processed_text = preprocess_text(payload.text)

    category, category_confidence = predict_category_with_model(processed_text, service.category_model, service.category_vocab, CATEGORY_LABELS)
    sentiment, sentiment_confidence = predict_sentiment_with_model(processed_text, service.sentiment_model, service.sentiment_vocab, SENTIMENT_LABELS)

    keywords = [token for token in processed_text.split() if len(token) > 3][:5]
    summary = (
        f"The article is classified as {category} with {sentiment.lower()} sentiment. "
        f"Confidence is {round(max(category_confidence, sentiment_confidence) * 100, 1)}%."
    )

    return PredictionResponse(
        category=category,
        sentiment=sentiment,
        confidence=round(max(category_confidence, sentiment_confidence) * 100, 1),
        keywords=keywords,
        summary=summary,
    )
app.include_router(api)