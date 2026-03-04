"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageUpload } from "./ImageUpload";
import { LiveScanning } from "./LiveScanning";

export function FaceScanningMainPage() {
  return (
    <>
      <style>{`
        

        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .skincare-gold {
          background: linear-gradient(
            90deg,
            #c9a96e 0%, #f5e4a0 20%, #e8c87a 40%,
            #c9a96e 55%, #f0d898 75%, #c9a96e 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .scan-heading {
          animation: fadeDown 0.8s 0.1s ease both;
        }
      `}</style>

      <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-start justify-center py-24">

        
        <motion.img
          src="https://assets.aceternity.com/linear-demo.webp"
          className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />

        <div className="relative z-10 flex flex-col items-center gap-16">

        
          <div className="scan-heading" style={{ textAlign: "center" }}>

          
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#c9a96e",
              fontWeight: 600,
              marginBottom: "16px",
              opacity: 0.85,
            }}>
              Face Analysis
            </p>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px, 7vw, 82px)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "white",
                margin: 0,
              }}
            >
              The best{" "}
              <span className="skincare-gold">Skincare</span>
              <br />
              you will ever find
            </h1>
            <h1 className="text-white mt-10 text-xl">
              For best results, upload a clear frontal profile image. Side or tilted faces may lead to inaccurate analysis.
            </h1>

            
            <div style={{
              width: "52px", height: "1.5px",
              background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
              margin: "20px auto 0",
              borderRadius: "999px",
              opacity: 0.7,
            }} />
          </div>

          <ImageUpload />
          <LiveScanning />
        </div>
      </div>
    </>
  );
}
