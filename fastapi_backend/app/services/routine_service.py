"""
Routine Service
Generates personalized skincare routines using Gemini LLM
Aligned with simplified Analysis model
"""

import os
import json
import aiohttp


GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/"
    "models/gemini-1.5-flash:generateContent"
)


async def generate_routine(analysis) -> dict:
    """
    Generate skincare routine recommendations using Gemini
    analysis -> Analysis SQLAlchemy object
    """

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not configured")

    # --------------------------------
    # Build context FROM SIMPLIFIED MODEL
    # --------------------------------
    analysis_context = f"""
Skin Analysis Results:
- Skin Type: {analysis.skin_type}
- Oil Level: {analysis.oil}/100
- Acne Level: {analysis.acne}/100
- Blackheads: {analysis.blackheads}/100
- Pigmentation: {analysis.pigmentation}/100
- Hydration: {analysis.hydration}/100
- Sensitivity: {analysis.sensitivity}/100

Summary:
{analysis.summary}
"""

    # --------------------------------
    # System Prompt (STRICT JSON)
    # --------------------------------
    system_prompt = """
You are a skincare expert AI.

Generate a SAFE, PRACTICAL, personalized skincare routine.
This is for cosmetic and informational purposes only.
DO NOT provide medical diagnosis.

RULES:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- Product steps must be gentle and non-prescription

JSON FORMAT:
{
  "morning": [
    {
      "step": 1,
      "productType": "Cleanser",
      "productName": "Gentle Cleanser",
      "instructions": "Massage on wet face and rinse",
      "reason": "Removes dirt without stripping skin"
    }
  ],
  "night": [
    {
      "step": 1,
      "productType": "Cleanser",
      "productName": "Gentle Cleanser",
      "instructions": "Clean face before sleep",
      "reason": "Removes impurities"
    }
  ],
  "weekly": [
    {
      "productType": "Exfoliant",
      "frequency": "1-2x per week",
      "instructions": "Apply after cleansing",
      "reason": "Helps reduce clogged pores"
    }
  ],
  "summary": "Why this routine suits the user's skin"
}
"""

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": system_prompt + "\n\n" + analysis_context
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.6,
            "maxOutputTokens": 1200
        }
    }

    # --------------------------------
    # Gemini API Call
    # --------------------------------
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{GEMINI_ENDPOINT}?key={api_key}",
            headers={"Content-Type": "application/json"},
            json=payload
        ) as response:

            if response.status != 200:
                error = await response.text()
                raise Exception(f"Gemini API error: {error}")

            data = await response.json()

    # --------------------------------
    # Parse Gemini Response Safely
    # --------------------------------
    try:
        content = (
            data["candidates"][0]
            ["content"]["parts"][0]["text"]
            .strip()
        )

        cleaned = (
            content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        routine_json = json.loads(cleaned)

    except Exception:
        raise ValueError("Invalid AI routine response format")

    return {
        "routineJson": routine_json,
        "summary": routine_json.get(
            "summary",
            "Personalized skincare routine generated from AI analysis"
        )
    }
