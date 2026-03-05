"use client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function LiveScanning() {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false); // shows preview flash
  const router = useRouter();
  const { data: session } = useSession();

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsScanning(true);
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access");
    }
  };
  
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setIsScanning(false);
    setCaptured(false);
  };

  
  const handleCapture = async () => {
    if (!session?.user?.id) {
      alert("Please login first");
      return;
    }

    
    const canvas = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    setCaptured(true);
    setTimeout(() => setCaptured(false), 300);

  
    canvas.toBlob(async (blob) => {
      try {
        setLoading(true);

        
        const formData = new FormData();
        formData.append("file", blob, "live-scan.jpg");

        // 5. Call the exact same API route
        const res = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/api/analysis/upload-and-analyze`,
          {
            method: "POST",
            headers: { "x-user-id": session.user.id },
            body: formData,
          }
        );

        const data = await res.json();
        console.log("Live scan API response:", JSON.stringify(data));

        if (!res.ok) {
          console.error("Analysis failed:", data);
          alert("Analysis failed");
          return;
        }

        
        localStorage.setItem("skinAnalysis", JSON.stringify(data.analysis));
        stopCamera();
        router.push("/result");

      } catch (err) {
        console.error("Live scan error:", err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg", 0.92);
  };

  return (
    <div className="w-full max-w-4xl mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

      {/* Heading */}
      <h2 style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: "clamp(20px, 3vw, 28px)",
        fontWeight: 700,
        color: "white",
        textAlign: "center",
        marginBottom: "24px",
        letterSpacing: "-0.01em",
      }}>
        Live Face{" "}
        <span style={{
          background: "linear-gradient(90deg, #c9a96e, #f5e4a0, #c9a96e)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>Scanning</span>
      </h2>

      
      <div className="relative w-full aspect-video rounded-2xl border border-white/10 bg-black overflow-hidden">

      
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black opacity-50" />

      
        {captured && (
          <div className="absolute inset-0 bg-white/30 z-20 pointer-events-none" />
        )}

        
        {isScanning && !loading && (
          <motion.div
            className="absolute left-0 right-0 h-[2px] z-10"
            style={{
              background: "linear-gradient(90deg, transparent, #c9a96e, #f5e4a0, #c9a96e, transparent)",
              boxShadow: "0 0 10px #c9a96e88",
            }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        )}

    
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 40, height: 40,
                borderRadius: "50%",
                border: "3px solid rgba(201,169,110,0.2)",
                borderTop: "3px solid #c9a96e",
              }}
            />
            <p style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>Analysing skin…</p>
          </div>
        )}

        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div style={{
            width: "176px", height: "240px",
            border: "1.5px solid rgba(201,169,110,0.6)",
            borderRadius: "12px",
            boxShadow: "0 0 24px rgba(201,169,110,0.15)",
          }} />
        </div>

      
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => {
          const [v, h] = pos.split("-");
          return (
            <div key={pos} style={{
              position: "absolute",
              [v]: "calc(50% - 120px)",
              [h]: "calc(50% - 88px)",
              width: "16px", height: "16px",
              borderTop:    v === "top"    ? "2px solid #c9a96e" : "none",
              borderBottom: v === "bottom" ? "2px solid #c9a96e" : "none",
              borderLeft:   h === "left"   ? "2px solid #c9a96e" : "none",
              borderRight:  h === "right"  ? "2px solid #c9a96e" : "none",
              zIndex: 11,
            }} />
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        {!isScanning ? (
          <button
            onClick={openCamera}
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.05em",
              padding: "11px 32px",
              borderRadius: "12px",
              border: "1px solid rgba(201,169,110,0.4)",
              background: "rgba(201,169,110,0.08)",
              color: "#f5e4a0",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,110,0.16)"; e.currentTarget.style.borderColor = "#c9a96e"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,169,110,0.08)"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)"; }}
          >
            ✦ &nbsp;Start Live Scan
          </button>
        ) : (
          <>
            <button
              onClick={handleCapture}
              disabled={loading}
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.05em",
                padding: "11px 32px",
                borderRadius: "12px",
                border: "1px solid rgba(201,169,110,0.6)",
                background: "linear-gradient(135deg, rgba(201,169,110,0.2), rgba(240,192,64,0.1))",
                color: "#f5e4a0",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg, rgba(201,169,110,0.3), rgba(240,192,64,0.18))"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(201,169,110,0.2), rgba(240,192,64,0.1))"; }}
            >
              {loading ? "Analysing…" : "📸 &nbsp;Capture & Analyse"}
            </button>

            <button
              onClick={stopCamera}
              disabled={loading}
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                padding: "11px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(224,92,92,0.3)",
                background: "transparent",
                color: "rgba(224,92,92,0.7)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(224,92,92,0.08)"; e.currentTarget.style.borderColor = "rgba(224,92,92,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(224,92,92,0.3)"; }}
            >
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
