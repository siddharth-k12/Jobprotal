from dotenv import load_dotenv
from langchain_mistralai import MistralAIEmbeddings

load_dotenv()


embeddings = MistralAIEmbeddings(
    model="mistral-embed",
    max_retries=2,
    timeout=30
)


_embedding_cache: dict[str, list[float]] = {}


def create_embeddings(
    texts: list[str]
) -> list[list[float]]:

    if not texts:
        return []

    normalized_texts = [
        text.strip().lower()
        for text in texts
        if text and text.strip()
    ]

    if not normalized_texts:
        return []

    # Remove duplicates while preserving order
    unique_texts = list(
        dict.fromkeys(normalized_texts)
    )

    missing_texts = [
        text
        for text in unique_texts
        if text not in _embedding_cache
    ]

    if missing_texts:

        new_embeddings = embeddings.embed_documents(
            missing_texts
        )

        for text, vector in zip(
            missing_texts,
            new_embeddings
        ):
            _embedding_cache[text] = vector

    return [
        _embedding_cache[text]
        for text in normalized_texts
    ]