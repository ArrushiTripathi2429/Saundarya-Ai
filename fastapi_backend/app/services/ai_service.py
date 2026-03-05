import os, json, io, asyncio, re, base64
from PIL import Image
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


MODELS = [
    "qwen/qwen3-vl-30b-a3b-thinking:free",  
    "google/gemma-3-27b-it:free",             
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "openrouter/free",                         
]


PROMPT = """
You are an AI skin analysis assistant for cosmetic and informational purposes only.
Do NOT provide medical diagnosis.

Analyze the face image and return ONLY valid JSON in the format below.
No explanation, no markdown, no extra text — just the raw JSON object.

{
  "skin_type": "Oily | Dry | Normal | Combination",
  "oil": 0-100,
  "acne": 0-100,
  "blackheads": 0-100,
  "pigmentation": 0-100,
  "hydration": 0-100,
  "sensitivity": 0-100,
  "summary": "Short, friendly explanation of visible skin conditions"
}
"""


def clamp(value, min_val=0, max_val=100):
    try:
        value = int(value)
    except:
        value = 0
    return max(min_val, min(max_val, value))


def extract_json(text: str):
    """Safely extract JSON from AI response"""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON found in AI response")
    return json.loads(match.group())


def call_model(model: str, img_base64: str):
    """Blocking call to OpenRouter — runs inside executor"""
    return client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img_base64}"
                        }
                    },
                    {
                        "type": "text",
                        "text": PROMPT
                    }
                ]
            }
        ]
    )


async def analyze_skin_image(image_bytes: bytes) -> dict:
    # Convert to RGB + base64
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_buffer = io.BytesIO()
    image.save(img_buffer, format="JPEG")
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode("utf-8")

    loop = asyncio.get_event_loop()
    last_error = None

    for model in MODELS:
        try:
            print(f"[AI] Trying model: {model}")
            response = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    lambda m=model: call_model(m, img_base64)
                ),
                timeout=60,  # ✅ Increased from 40s → 60s for mobile + cold starts
            )

            raw_text = (response.choices[0].message.content or "").strip()
            result = extract_json(raw_text)

            print(f"[AI] ✅ Success with model: {model}")
            return {
                "skin_type": result.get("skin_type", "NORMAL").upper(),
                "oil":          clamp(result.get("oil")),
                "acne":         clamp(result.get("acne")),
                "blackheads":   clamp(result.get("blackheads")),
                "pigmentation": clamp(result.get("pigmentation")),
                "hydration":    clamp(result.get("hydration")),
                "sensitivity":  clamp(result.get("sensitivity")),
                "summary":      result.get("summary", "Skin analysis completed based on visible features."),
            }

        except asyncio.TimeoutError:
            print(f"[AI] ⏱ Timeout with model: {model}")
            last_error = "Request timed out"
            continue  # try next model

        except Exception as e:
            print(f"[AI] ❌ Error with model {model}: {e}")
            last_error = str(e)
            continue  # try next model

    # All models failed
    raise ValueError(f"AI analysis failed after trying all models. Last error: {last_error}")


def generate_routine_from_analysis(analysis: dict) -> dict:
    oil         = analysis.get("oil", 0)
    acne        = analysis.get("acne", 0)
    hydration   = analysis.get("hydration", 0)
    sensitivity = analysis.get("sensitivity", 0)
    summary     = analysis.get("summary", "")

    morning = [
        {"step": 1, "productType": "Cleanser",    "instructions": "Oil-control cleanser" if oil > 50 else "Gentle hydrating cleanser"},
        {"step": 2, "productType": "Toner",       "instructions": "Niacinamide toner" if oil > 50 else "Hydrating toner"},
        {"step": 3, "productType": "Serum",       "instructions": "Vitamin C serum for brightening"},
        {"step": 4, "productType": "Moisturiser", "instructions": "Oil-free gel moisturiser" if oil > 50 else "Rich hydrating moisturiser"},
        {"step": 5, "productType": "Sunscreen",   "instructions": "SPF 50 broad spectrum (non-negotiable!)"},
    ]

    evening = [
        {"step": 1, "productType": "Oil Cleanser", "instructions": "Double cleanse to remove sunscreen & makeup"},
        {"step": 2, "productType": "Face Wash",    "instructions": "Salicylic acid (2%) cleanser" if acne > 30 else "Gentle foam cleanser"},
        {"step": 3, "productType": "Serum",        "instructions": "Retinol serum (start 2x/week)" if acne > 30 else "Hyaluronic acid serum"},
        {"step": 4, "productType": "Moisturiser",  "instructions": "Lightweight gel" if oil > 50 else "Ceramide night cream"},
        {"step": 5, "productType": "Eye Cream",    "instructions": "Hydrating eye cream" if hydration < 50 else "Caffeine eye cream"},
    ]

    weekly = [
        {"step": 1, "productType": "Exfoliant", "instructions": "AHA/BHA exfoliant 2x per week"},
        {"step": 2, "productType": "Face Mask", "instructions": "Clay mask for oily zones" if oil > 50 else "Hydrating sheet mask"},
        {"step": 3, "productType": "Lip Care",  "instructions": "Exfoliate and hydrate lips once a week"},
    ]

    return {
        "morning": morning,
        "evening": evening,
        "weekly":  weekly,
        "summary": summary,
    }
