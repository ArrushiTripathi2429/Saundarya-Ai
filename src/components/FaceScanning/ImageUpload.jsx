"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/ui/file-upload";

export function ImageUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleFileUpload = (files) => {
    setFiles(files);
  };

  const handleAnalyze = async () => {
    console.log(" handleAnalyze triggered");
    console.log("Files:", files);
    console.log("Session:", session);

    if (!files.length) return;

    if (!session?.user?.id) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

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
      console.log("Full API response:", JSON.stringify(data));

      if (!res.ok) {
        console.error("Analysis failed:", data);
        alert("Analysis failed");
        return;
      }

      
      localStorage.setItem("skinAnalysis", JSON.stringify(data.analysis));

      router.push("/result");
    } catch (err) {
      console.error("Analyze error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="min-h-96 border border-dashed rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>

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