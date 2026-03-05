import os
import resend

def send_routine_email(to_email: str, user_name: str, routine_json: dict) -> bool:
    try:
        resend.api_key = os.getenv("RESEND_API_KEY")

        def format_steps(steps):
            if not steps:
                return "No specific steps provided."
            return "\n".join([
                f"{s.get('step', '-')}. {s.get('productType', 'Product')} - {s.get('instructions', '')}"
                for s in steps
            ])

        body = (
            f"Hi {user_name},\n\n"
            f"Here is your personalized skincare routine\n\n"
            f"MORNING:\n{format_steps(routine_json.get('morning', []))}\n\n"
            f"EVENING:\n{format_steps(routine_json.get('evening', []))}\n\n"
            f"WEEKLY CARE:\n{format_steps(routine_json.get('weekly', []))}\n\n"
            f"Summary:\n{routine_json.get('summary', 'No summary available.')}\n\n"
            f"Stay consistent and glow!\n"
            f"- Saundarya AI"
        )

        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": to_email,
            "subject": "Your Personalized Skincare Routine",
            "text": body
        })
        return True

    except Exception as e:
        print("Email sending failed:", str(e))
        return False