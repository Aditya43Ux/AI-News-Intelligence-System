from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from .artifact_utils import save_training_artifacts
from .classifier import load_category_model
from .forecast import load_forecast_model, load_forecast_window
from .sentiment import load_sentiment_model
from .utils import ensure_model_dir


@dataclass
class ModelService:
    category_model: Optional[object] = None
    category_vocab: Optional[object] = None
    sentiment_model: Optional[object] = None
    sentiment_vocab: Optional[object] = None
    forecast_model: Optional[object] = None
    scaler: Optional[object] = None
    last_window: Optional[list[float]] = None
    _loaded: bool = False

    def load_models(self) -> None:
        if self._loaded:
            return

        directory = ensure_model_dir()
        self.category_model, self.category_vocab = load_category_model(directory)
        self.sentiment_model, self.sentiment_vocab = load_sentiment_model(directory)
        self.forecast_model, self.scaler = load_forecast_model(directory)
        self.last_window = load_forecast_window(directory)

        if self.category_model is None or self.category_vocab is None or self.sentiment_model is None or self.sentiment_vocab is None or self.forecast_model is None or self.scaler is None or self.last_window is None:
            save_training_artifacts(
                category_model={"kind": "rule-based"},
                category_vocab={"<PAD>": 0, "<UNK>": 1},
                sentiment_model={"kind": "rule-based"},
                sentiment_vocab={"<PAD>": 0, "<UNK>": 1},
                forecast_model={"kind": "rule-based"},
                scaler={"kind": "minmax"},
                last_window=[45.0, 46.0, 44.0, 47.0, 46.0, 48.0, 49.0, 50.0, 49.0, 51.0, 50.0, 52.0, 51.0, 53.0],
                model_dir=directory,
            )
            self.category_model, self.category_vocab = load_category_model(directory)
            self.sentiment_model, self.sentiment_vocab = load_sentiment_model(directory)
            self.forecast_model, self.scaler = load_forecast_model(directory)
            self.last_window = load_forecast_window(directory)

        self._loaded = True


_model_service: Optional[ModelService] = None


def get_model_service() -> ModelService:
    global _model_service
    if _model_service is None:
        _model_service = ModelService()
    return _model_service
