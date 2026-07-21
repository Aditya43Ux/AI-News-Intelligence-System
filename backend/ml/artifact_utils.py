from pathlib import Path
from typing import Any, Optional

import torch

from .utils import ensure_model_dir, save_pickle


def save_training_artifacts(
    category_model: Optional[Any],
    category_vocab: Optional[Any],
    sentiment_model: Optional[Any],
    sentiment_vocab: Optional[Any],
    forecast_model: Optional[Any],
    scaler: Optional[Any],
    last_window: Optional[list[float]],
    model_dir: Optional[Path] = None,
) -> None:
    directory = Path(model_dir or ensure_model_dir())
    directory.mkdir(parents=True, exist_ok=True)

    if category_model is not None and category_vocab is not None:
        torch.save(category_model, directory / "news_classifier.pt")
        save_pickle(category_vocab, directory / "category_vocab.pkl")

    if sentiment_model is not None and sentiment_vocab is not None:
        torch.save(sentiment_model, directory / "sentiment_model.pt")
        save_pickle(sentiment_vocab, directory / "sentiment_vocab.pkl")

    if forecast_model is not None and scaler is not None:
        torch.save(forecast_model, directory / "lstm_forecaster.pt")
        save_pickle(scaler, directory / "scaler.pkl")

    if last_window is not None:
        save_pickle(last_window, directory / "last_window.pkl")
