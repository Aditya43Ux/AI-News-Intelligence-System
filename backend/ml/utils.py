import os
import pickle
from pathlib import Path
from typing import Any, Iterable


def get_model_dir() -> Path:
    return Path(os.getenv("MODEL_DIR", Path(__file__).resolve().parents[1] / "models")).resolve()


def ensure_model_dir() -> Path:
    directory = get_model_dir()
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def load_pickle(path: str | os.PathLike[str]) -> Any:
    with open(path, "rb") as handle:
        return pickle.load(handle)


def save_pickle(payload: Any, path: str | os.PathLike[str]) -> None:
    with open(path, "wb") as handle:
        pickle.dump(payload, handle)


def pick_top_label(probabilities: Iterable[float], labels: list[str]) -> tuple[str, float]:
    probs = list(probabilities)
    if not probs:
        return labels[0], 0.0
    index = int(max(range(len(probs)), key=lambda i: probs[i]))
    return labels[index], float(probs[index])
