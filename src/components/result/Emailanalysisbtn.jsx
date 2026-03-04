"use client";

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

const Emailanalysisbtn = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSendRoutine = async () => {
    const stored = localStorage.getItem("skinAnalysis");
    if (!stored) {
      alert("No analysis found. Please analyze your skin first.");
      return;
    }

    if (!session?.user?.email || !session?.user?.id) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const analysis = JSON.parse(stored);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send-routine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({
          email:       session.user.email,
          user_name:   session.user.name ?? "Gorgeous",
          analysis_id: analysis.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError("Failed to send email. Try again.");
        return;
      }

      setSent(true);

    } catch (err) {
      console.error("Email error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .button-bg {
          background: linear-gradient(270deg, #00F5FF, #0050ff, #000, #00F5FF);
          background-size: 300% 300%;
          animation: shine 3s ease infinite;
          padding: 1.5px;
          border-radius: 9999px;
          display: inline-block;
        }
      `}</style>

      <div className="flex flex-col justify-center items-center w-full mt-8 gap-3">
        {sent ? (
          <p className="text-cyan-400 font-semibold text-base">
            ✅ Routine sent to {session?.user?.email}
          </p>
        ) : (
          <div className="button-bg hover:scale-105 transition duration-300 active:scale-100">
            <button
              onClick={handleSendRoutine}
              disabled={loading}
              className="px-12 text-base py-3.5 text-white rounded-full font-semibold bg-gray-800 block tracking-wide disabled:opacity-50"
            >
              {loading ? "Sending..." : "Get Your Skin Routine"}
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </>
  );
}

export default Emailanalysisbtn;