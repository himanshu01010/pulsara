from pydantic import BaseModel
from typing import List, Optional

class TrendRequest(BaseModel):
    trends: List[str]


class Article(BaseModel):
    tag: str
    headline: str
    summary: str
    body: str
    image_query: str
    image_url: Optional[str]=None
    sources: List[str]=[]

class ContentResponse(BaseModel):
    articles: List[Article]
    skipped_duplicates: int
    total_processed: int 