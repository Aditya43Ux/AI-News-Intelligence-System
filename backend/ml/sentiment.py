from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import torch
import torch.nn as nn

from .preprocess import preprocess_text, tokenize
from .utils import ensure_model_dir, load_pickle, pick_top_label

SENTIMENT_LABELS = ["Negative", "Positive"]
DEFAULT_MAX_LEN = 50


class BiLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes=2, num_layers=2, dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            input_size=embed_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=dropout if num_layers > 1 else 0,
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * 2, num_classes)

    def forward(self, x):
        x = self.embedding(x)
        lstm_out, (hidden, _) = self.lstm(x)
        hidden_fwd = hidden[-2]
        hidden_bwd = hidden[-1]
        combined = torch.cat([hidden_fwd, hidden_bwd], dim=1)
        out = self.dropout(combined)
        return self.fc(out)


def build_vocab(texts: List[str], max_vocab: int = 10000) -> Dict[str, int]:
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


def _heuristic_sentiment_prediction(text: str, labels: Optional[List[str]] = None) -> Tuple[str, float]:
    labels = labels or SENTIMENT_LABELS
    tokens = set(preprocess_text(text).split())
    positive_terms = {"growth", "rise", "surge", "profit", "boost", "win", "strong", "optimistic", "positive", "good"}
    negative_terms = {"fall", "decline", "loss", "crash", "warn", "risk", "down", "negative", "bankrupt", "attack", "war"}
    positive_score = sum(1 for token in tokens if token in positive_terms)
    negative_score = sum(1 for token in tokens if token in negative_terms)
    if positive_score > negative_score:
        label = "Positive"
        confidence = min(0.96, 0.6 + 0.08 * positive_score)
    elif negative_score > positive_score:
        label = "Negative"
        confidence = min(0.96, 0.6 + 0.08 * negative_score)
    else:
        label = "Positive"
        confidence = 0.55
    return label, confidence


def predict_sentiment_with_model(text: str, model: Optional[Any], vocab: Optional[Dict[str, int]], labels: Optional[List[str]] = None) -> Tuple[str, float]:
    labels = labels or SENTIMENT_LABELS
    if model is None or vocab is None:
        return _heuristic_sentiment_prediction(text, labels)
    if isinstance(model, dict) and model.get("kind") == "rule-based":
        return _heuristic_sentiment_prediction(text, labels)
    model.eval()
    ids = text_to_ids(text, vocab)
    tensor = torch.tensor([ids], dtype=torch.long)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0].cpu().tolist()
        print("Probabilities:", probs)
    print("Predicted label:", pick_top_label(probs, labels))
    return pick_top_label(probs, labels)


def load_sentiment_model(model_dir: Optional[Path] = None) -> Tuple[Optional[Any], Optional[Dict[str, int]]]:
    directory = Path(model_dir or ensure_model_dir())
    model_path = directory / "sentiment_model.pt"
    vocab_path = directory / "sentiment_vocab.pkl"
    if not model_path.exists() or not vocab_path.exists():
        return None, None

    vocab = load_pickle(vocab_path)
    try:
        state = torch.load(model_path, map_location="cpu")
    except Exception:
        return None, vocab
    if isinstance(state, dict) and state.get("kind") == "rule-based":
        return state, vocab
    model = BiLSTM(vocab_size=len(vocab), embed_dim=128, hidden_dim=128, num_classes=2)
    if isinstance(state, dict) and any(isinstance(value, torch.Tensor) for value in state.values()):
        model.load_state_dict(state)
    else:
        model = state
    return model, vocab
