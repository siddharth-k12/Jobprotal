from fastapi import APIRouter

from app.schemas.matching import EmbeddingRequest
from app.services.embedding_service import create_embeddings


router = APIRouter(
    prefix="/embedding",
    tags=["Embedding"]
)


@router.post("/test")
def test_embedding(data: EmbeddingRequest):

    vectors = create_embeddings(data.texts)

    return {
        "count": len(vectors),
        "dimensions": len(vectors[0]) if vectors else 0,
        "embeddings": vectors
    }