from pathlib import Path
from typing import Any, Optional, Sequence, Tuple

import numpy as np
import torch
import torch.nn as nn

from .utils import ensure_model_dir, load_pickle


class LSTMForecaster(nn.Module):
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0,
        )
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        last_out = lstm_out[:, -1, :]
        return self.fc(last_out)


def _heuristic_forecast(last_window: Optional[Sequence[float]], n_steps: int = 7) -> list[float]:
    if not last_window:
        return [45.0, 47.0, 49.0, 51.0, 53.0, 55.0, 57.0]
    series = np.array(list(last_window), dtype=np.float32)
    if len(series) < 2:
        return [float(series[-1])] * n_steps
    trend = float(np.polyfit(np.arange(len(series)), series, 1)[0])
    base = float(series[-1])
    predictions = []
    for step in range(n_steps):
        next_value = base + trend * (step + 1) + 0.5 * (step % 3)
        predictions.append(round(next_value, 2))
        base = next_value
    return predictions


def forecast_future(model: Optional[Any], last_window: Optional[Sequence[float]], scaler, n_steps: int = 7) -> list[float]:
    if model is None or scaler is None or last_window is None:
        return _heuristic_forecast(last_window, n_steps)
    if isinstance(model, dict) and model.get("kind") == "rule-based":
        return _heuristic_forecast(last_window, n_steps)

    model.eval()
    current_window = np.array(last_window, dtype=np.float32).reshape(-1, 1)
    future_preds = []
    for _ in range(n_steps):
        x = torch.tensor(current_window[-14:].reshape(1, -1, 1), dtype=torch.float32)
        with torch.no_grad():
            next_val = model(x).numpy()[0, 0]
        future_preds.append(float(next_val))
        current_window = np.vstack([current_window[1:], [[next_val]]])

    if hasattr(scaler, "inverse_transform"):
        transformed = np.array(future_preds, dtype=np.float32).reshape(-1, 1)
        return scaler.inverse_transform(transformed).reshape(-1).tolist()
    return future_preds


def load_forecast_model(model_dir: Optional[Path] = None) -> Tuple[Optional[Any], Optional[object]]:
    directory = Path(model_dir or ensure_model_dir())
    model_path = directory / "lstm_forecaster.pt"
    scaler_path = directory / "scaler.pkl"
    if not model_path.exists() or not scaler_path.exists():
        return None, None

    scaler = load_pickle(scaler_path)
    try:
        state = torch.load(model_path, map_location="cpu")
    except Exception:
        return None, scaler
    if isinstance(state, dict) and state.get("kind") == "rule-based":
        return state, scaler
    model = LSTMForecaster(input_size=1, hidden_size=64, num_layers=2)
    if isinstance(state, dict) and any(isinstance(value, torch.Tensor) for value in state.values()):
        model.load_state_dict(state)
    else:
        model = state
    return model, scaler


def load_forecast_window(model_dir: Optional[Path] = None) -> Optional[list[float]]:
    directory = Path(model_dir or ensure_model_dir())
    window_path = directory / "last_window.pkl"
    if not window_path.exists():
        return None
    return load_pickle(window_path)
