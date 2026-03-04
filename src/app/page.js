"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/homepage/HeroSection";
import Features from "@/components/homepage/Features";
import { FaceScanningMainPage } from "@/components/FaceScanning/FaceScanningMainPage";

// Disable SSR for animation-heavy component
const BelowHeroSection = dynamic(
  () => import("@/components/homepage/BelowHeroSection"),
  { ssr: false }
);

const Page = () => {
  return (
    <div>
      <HeroSection />
      <BelowHeroSection />
      <Features/>
    </div>
  );
};

export default Page;
