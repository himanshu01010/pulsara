import asyncio
from fastapi import APIRouter, HTTPException

from app.models.schemas import TrendRequest, ContentResponse, Article
from app.services.news_context import fetch_news_context
from app.services.ai_writer import write_article
from app.services.image_service import generate_ai_image
from app.utils.deduplicate import deduplicate_trends  
from app.config.settings import settings

router = APIRouter()


async def process_single_trend(tag: str) -> Article | None:
    try:
        context = await fetch_news_context(tag)

        article = await write_article(tag, context)

        image_url = await generate_ai_image(article.image_query)
        article.image_url = image_url

        return article

    except Exception as e:
        print(f"[routes] Error: {e}")
        return None


async def process_single_trend_with_timeout(tag: str) -> Article | None:
    try:
        return await asyncio.wait_for(
            process_single_trend(tag),
            timeout=settings.PER_TREND_TIMEOUT_SECONDS
        )
    except asyncio.TimeoutError:
        print(f"[routes] Timeout while processing: {tag}")
        return None


@router.post("/process-trends", response_model=ContentResponse)
async def process_trends(request: TrendRequest):

    if not request.trends:
        raise HTTPException(status_code=400, detail="Empty trends")

    unique_trends, skipped = deduplicate_trends(request.trends)

    trends = unique_trends[:settings.MAX_TRENDS_TO_PROCESS]

    results = []

    for tag in trends:
        print(f"🚀 Processing: {tag}")

        article = await process_single_trend_with_timeout(tag)
        results.append(article)

        if settings.TREND_PROCESS_DELAY_SECONDS > 0:
            await asyncio.sleep(settings.TREND_PROCESS_DELAY_SECONDS)

    articles = [a for a in results if a]

    return ContentResponse(
        articles=articles,
        skipped_duplicates=skipped, 
        total_processed=len(articles),
    )

@router.get("/health")
async def health():
    return {"status": "ok"}
