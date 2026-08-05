// ─────────────────────────────────────────────────────────────
// Root entry — v2 cinematic rebuild
// ─────────────────────────────────────────────────────────────
import React from "react";
import { Composition, registerRoot } from "remotion";
import { BrandArxVideo } from "./compositions/BrandArxVideo";
import { FPS, TOTAL_FRAMES } from "./tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Landscape — YouTube / standard */}
      <Composition
        id="BrandArxLandscape"
        component={BrandArxVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={{}}
      />

      {/* Vertical — Instagram Reels / TikTok / YouTube Shorts */}
      <Composition
        id="BrandArxVertical"
        component={BrandArxVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

registerRoot(RemotionRoot);
