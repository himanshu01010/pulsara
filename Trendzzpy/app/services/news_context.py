import httpx
import feedparser


async def fetch_news_context(tag: str) -> str:
    try:
        url = f"https://news.google.com/rss/search?q={tag}&hl=en-IN&gl=IN&ceid=IN:en"

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url)

        feed = feedparser.parse(response.text)

        articles = feed.entries[:3]

        if not articles:
            return f"Trending topic: {tag}"

        context = " ".join(
            f"{a.get('title', '')}" for a in articles
        )

        return context[:1000]

    except Exception as e:
        print(f"[news_context] Error: {e}")
        return f"Trending topic: {tag}"