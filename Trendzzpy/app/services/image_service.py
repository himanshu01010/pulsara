import httpx
import cloudinary
import cloudinary.uploader
from app.config.settings import settings


# Cloudinary config
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)



async def generate_ai_image(prompt: str):
    try:
        prompt = prompt.replace("#", "").strip()
        prompt = f"""Ultra realistic news photograph of {prompt}.

            Scene description:
            - real world situation related to {prompt}
            - captured by a professional news photographer
            - natural lighting, no artificial effects
            - detailed background, environment visible

            Camera details:
            - DSLR photo
            - sharp focus
            - high resolution
            - cinematic composition

            Style constraints:
            - no cartoon
            - no illustration
            - no CGI
            - no blur
            - no distortion

            Mood:
            - realistic
            - journalistic
            - documentary style
        """

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                settings.HF_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.HF_TOKEN}",
                    "Content-Type": "application/json",
                },
                json={"inputs": prompt}
            )

        if response.status_code != 200:
            print("HF error:", response.text)
            return None

        image_bytes = response.content

        upload = cloudinary.uploader.upload(
            image_bytes,
            resource_type="image"
        )

        return upload["secure_url"] 

    except Exception as e:
        print("Image error:", e)
        return None