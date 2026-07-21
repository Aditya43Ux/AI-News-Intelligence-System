import re
from typing import List

STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "in", "is", "it", "its",
    "of", "on", "or", "our", "that", "the", "their", "this", "to", "was", "were", "will", "with"
}


def clean_text(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    tokens = [token for token in text.split() if token not in STOPWORDS and len(token) > 1]
    return " ".join(tokens)


def tokenize(text: str) -> List[str]:
    cleaned = clean_text(text)
    return cleaned.split() if cleaned else []


def preprocess_text(text: str) -> str:
    return clean_text(text)
