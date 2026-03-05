#  Saundarya AI

AI-powered skincare analysis platform that analyzes facial features and generates **personalized skincare routines**.

The idea behind this project came from a very personal problem — dealing with pimples and unpredictable skin breakouts. Instead of trying random solutions, I wanted to experiment with **AI + computer vision** to better understand skin conditions and generate routines tailored to each user.

---

#  Features

-  Face scan & skin analysis  
-  AI-generated personalized skincare routine  
-  Facial feature detection using **MediaPipe**  
-  Secure authentication  
-  Email delivery of skincare routines  
-  Modern animated UI  
-  Production deployment  

---

#  Tech Stack

## Frontend
- Next.js
- Aceternity UI
- Tailwind CSS

## Backend
- FastAPI (Python)

## AI & Computer Vision
- MediaPipe – facial feature detection  
- OpenRouter API – AI skincare recommendations  

## Authentication & Database
- NextAuth  
- Prisma ORM  
- PostgreSQL (Neon)

## Email Service
- Resend API

---

#  Deployment

- Vercel → Frontend  
- Render → Backend  
- UptimeRobot → Backend monitoring  

---

#  Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/saundarya-ai.git
cd saundarya-ai
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open in your browser:

```
http://localhost:3000
```

---

# ⚙️ Environment Variables

Create a `.env` file and add:

```
NEXTAUTH_SECRET=
NEXTAUTH_URL=

DATABASE_URL=

OPENROUTER_API_KEY=
RESEND_API_KEY=
```

---

#  What I Learned

This project helped me understand how to integrate:

- AI APIs  
- Computer vision  
- Authentication systems  
- Database management  
- Full-stack deployment  
- Production monitoring  

into a **single working application**.

---

#  Challenges Faced

Some interesting debugging moments during development:

- Deployed the **frontend but forgot to deploy backend**
- Added API calls but **forgot to add ENV variables**
- Prisma version conflicts  
- Python compatibility issues with OpenCV  
- MediaPipe installation conflicts  

Classic developer loop:

```
Build → Error → Debug → Fix → New Error → Repeat
```


# Future Improvements

- Skin type classification model  
- Acne severity detection  
- Dermatology dataset training  
- Faster inference pipeline  
- Mobile optimization  
