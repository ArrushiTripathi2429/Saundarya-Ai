"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/ui/file-upload";

export function ImageUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ error state
  const router = useRouter();
  const { data: session } = useSession();

  const handleFileUpload = (files) => {
    setFiles(files);
    setError(null); // clear error on new upload
  };

  const handleAnalyze = async () => {
    if (!files.length) return;

    if (!session?.user?.id) {
      setError("Please login first.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // clear previous error

      const formData = new FormData();
      formData.append("file", files[0].file ?? files[0]);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analysis/upload-and-analyze`,
        {
          method: "POST",
          headers: {
            "x-user-id": session.user.id,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError("AI services are temporarily unavailable. Please try again.");
        return;
      }

      localStorage.setItem("skinAnalysis", JSON.stringify(data.analysis));
      router.push("/result");

    } catch (err) {
      console.error("Analyze error:", err);
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="min-h-96 border border-dashed rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>

      
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <span className="text-lg">😔</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-400">AI Services temporarily busy, Please try again later.</p>
            <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400/50 hover:text-red-400 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading || !files.length}
        className="w-full rounded-xl bg-black text-white py-3 font-semibold disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Skin"}
      </button>
    </div>
  );
}
