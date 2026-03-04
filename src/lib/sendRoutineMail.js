import { transporter } from "./mailer";

export async function sendRoutineMail({ to, name, routine }) {
  const html = `
    <h2>Hi ${name} 👋</h2>
    <p>Your personalized skincare routine is ready ✨</p>

    <h3>🌞 Morning Routine</h3>
    <ul>
      ${routine.morning.map(step => `<li>${step}</li>`).join("")}
    </ul>

    <h3>🌙 Night Routine</h3>
    <ul>
      ${routine.night.map(step => `<li>${step}</li>`).join("")}
    </ul>

    <p>Stay consistent 💖</p>
    <p><b>– AabhaAi</b></p>
  `;

  await transporter.sendMail({
    from: `"AabhaAi" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Personalized Skincare Routine 🌿",
    html,
  });
}
