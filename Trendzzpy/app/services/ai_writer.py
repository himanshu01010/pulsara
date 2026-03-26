import json
import re
from openai import OpenAI
from app.config.settings import settings
from app.models.schemas import Article

api_key=settings.GROQ_API_KEY
url= settings.GROQ_BASE_URL
client = OpenAI(
    api_key=api_key,
    base_url=url
)

SYSTEM_PROMPT = """
You are a professional news writer for a government-approved digital news platform in India.

STRICT CONTENT GUIDELINES (mandatory):
- NO abusive, offensive, or hate speech
- NO communally sensitive, divisive, or inflammatory language
- NO unverified medical, legal, or financial claims
- NO graphic violence or disturbing imagery descriptions
- Follow Press Council of India (PCI) guidelines
- Be factual, neutral, and balanced across all communities
- Use respectful and inclusive language
- Avoid speculation — report only likely verified facts

OUTPUT RULES:
- Respond ONLY with a valid JSON object
- No markdown, no code fences, no extra text before or after JSON
- All fields must be present

JSON FORMAT:
{
  "headline": "Clear, factual headline under 100 characters",
  "summary": "2-3 sentence neutral summary",
  "body": "3-4 paragraphs of balanced news content",
  "image_query": "safe Unsplash search term (no faces, no violence)"
}
"""


def clean_json(raw: str) -> str:
    raw = re.sub(r"^```json\s*|^```\s*|```$", "", raw).strip()
    raw = raw.replace("\n", " ").replace("\r", " ")
    return raw


def extract_json(raw: str) -> dict:
    try:
        return json.loads(raw)
    except:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {}


async def write_article(tag: str, context: str) -> Article:
    try:
        context = context[:500]

        response = client.chat.completions.create(
            model=settings.MODEL,   
            temperature=0.3,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f'Write short news article on "{tag}". Context: {context}'
                }
            ]
        )

        raw = response.choices[0].message.content.strip()
        print("🧠 RAW:", raw)

        cleaned = clean_json(raw)
        data = extract_json(cleaned)

        return Article(
            tag=tag,
            headline=data.get("headline", ""),
            summary=data.get("summary", ""),
            body=data.get("body", ""),
            image_query=data.get("image_query", tag),
        )

    except Exception as e:
        print(f"[ai_writer] Failed for '{tag}': {e}")

        return Article(
            tag=tag,
            headline=f"{tag} trending news",
            summary="AI parsing failed",
            body="Content unavailable",
            image_query=tag,
        )