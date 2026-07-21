from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import torch
import torch.nn as nn

from .preprocess import preprocess_text, tokenize
from .utils import ensure_model_dir, load_pickle, pick_top_label

CATEGORY_LABELS = ["World", "Sports", "Business", "Sci/Tech"]
DEFAULT_MAX_LEN = 100


class TextCNN(nn.Module):
    def __init__(self, vocab_size, embed_dim, num_classes, num_filters=128, filter_sizes=(2, 3, 4), dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.convs = nn.ModuleList([
            nn.Conv1d(in_channels=embed_dim, out_channels=num_filters, kernel_size=fs)
            for fs in filter_sizes
        ])
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(num_filters * len(filter_sizes), num_classes)

    def forward(self, x):
        x = self.embedding(x)
        x = x.permute(0, 2, 1)
        pooled = []
        for conv in self.convs:
            c = torch.relu(conv(x))
            c = c.max(dim=2).values
            pooled.append(c)
        x = torch.cat(pooled, dim=1)
        x = self.dropout(x)
        return self.fc(x)


def build_vocab(texts: List[str], max_vocab: int = 20000) -> Dict[str, int]:
    counter: Dict[str, int] = {}
    for text in texts:
        for word in tokenize(text):
            counter[word] = counter.get(word, 0) + 1
    vocab = {"<PAD>": 0, "<UNK>": 1}
    for word, _ in sorted(counter.items(), key=lambda item: item[1], reverse=True)[: max_vocab - 2]:
        vocab[word] = len(vocab)
    return vocab


def text_to_ids(text: str, vocab: Dict[str, int], max_len: int = DEFAULT_MAX_LEN) -> List[int]:
    words = tokenize(text)
    ids = [vocab.get(word, 1) for word in words]
    if len(ids) < max_len:
        ids += [0] * (max_len - len(ids))
    else:
        ids = ids[:max_len]
    return ids


def _heuristic_category_prediction(text: str, labels: Optional[List[str]] = None) -> Tuple[str, float]:
    labels = labels or CATEGORY_LABELS
    tokens = set(preprocess_text(text).split())
    keyword_map = {
        "World": {"world", "global", "government", "election", "policy", "war", "treaty", "diplomatic", "foreign"},
        "Sports": {"sport", "football", "basketball", "tennis", "league", "match", "player", "cup", "stadium", "team"},
        "Business": {"business", "stock", "market", "company", "finance", "earnings", "investor", "trade", "economic"},
        "Sci/Tech": {"technology", "tech", "ai", "software", "computer", "robot", "chip", "startup", "digital", "scientist"},
    }
    scores = {label: sum(1 for token in tokens if token in keyword_map[label]) for label in labels}
    if not any(scores.values()):
        if any(token in tokens for token in {"stock", "market", "company", "earnings", "trade"}):
            scores["Business"] = 1
        if any(token in tokens for token in {"technology", "ai", "software", "chip", "digital"}):
            scores["Sci/Tech"] = 1
        if any(token in tokens for token in {"team", "league", "player", "match", "stadium"}):
            scores["Sports"] = 1
        if any(token in tokens for token in {"election", "policy", "war", "government", "foreign"}):
            scores["World"] = 1
    top_label = max(scores, key=scores.get)
    confidence = min(0.96, 0.6 + 0.08 * max(scores.values()) + 0.03 * min(len(tokens), 10) / 10)
    return top_label, confidence


def predict_category_with_model(text: str, model: Optional[Any], vocab: Optional[Dict[str, int]], labels: Optional[List[str]] = None) -> Tuple[str, float]:
    labels = labels or CATEGORY_LABELS
    if model is None or vocab is None:
        return _heuristic_category_prediction(text, labels)
    if isinstance(model, dict) and model.get("kind") == "rule-based":
        return _heuristic_category_prediction(text, labels)
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba([text])[0]
        return pick_top_label(probs, labels)

    model.eval()
    ids = text_to_ids(text, vocab)
    tensor = torch.tensor([ids], dtype=torch.long)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0].cpu().tolist()
    return pick_top_label(probs, labels)


def load_category_model(model_dir: Optional[Path] = None) -> Tuple[Optional[Any], Optional[Dict[str, int]]]:
    directory = Path(model_dir or ensure_model_dir())
    model_path = directory / "news_classifier.pt"
    vocab_path = directory / "category_vocab.pkl"
    if not model_path.exists() or not vocab_path.exists():
        return None, None

    vocab = load_pickle(vocab_path)
    try:
        state = torch.load(model_path, map_location="cpu")
    except Exception:
        return None, vocab
    if isinstance(state, dict) and state.get("kind") == "rule-based":
        return state, vocab
    model = TextCNN(vocab_size=len(vocab), embed_dim=128, num_classes=4)
    if isinstance(state, dict) and any(isinstance(value, torch.Tensor) for value in state.values()):
        model.load_state_dict(state)
    else:
        model = state
    return model, vocab
