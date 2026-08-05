// ─────────────────────────────────────────────────────────────
// BrandArxVideo — cinematic timeline composition v2
// 7 scenes · 30 seconds · 30fps
// Works for both 1280×720 and 1080×1920 (all sizes relative)
// ─────────────────────────────────────────────────────────────
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SCENES, XFADE } from "../tokens";
import { Scene1ColdOpen }  from "../scenes/Scene1ColdOpen";
import { Scene2Problem }   from "../scenes/Scene2Problem";
import { Scene3Dashboard } from "../scenes/Scene3Dashboard";
import { Scene4AI }        from "../scenes/Scene4AI";
import { Scene5Results }   from "../scenes/Scene5Results";
import { Scene6Design }    from "../scenes/Scene6Design";
import { Scene7Outro }     from "../scenes/Scene7Outro";

// Cross-dissolve opacity — scene is visible from (sceneIn - XFADE/2) to (sceneOut + XFADE/2)
function xfadeOpacity(
  frame: number,
  sceneIn: number,
  sceneOut: number,
  xfade: number,
): number {
  const fadeInEnd   = sceneIn  + xfade;
  const fadeOutStart= sceneOut - xfade;

  if (frame < sceneIn)          return interpolate(frame, [sceneIn - xfade, sceneIn],       [0, 1], { extrapolateLeft:"clamp",  extrapolateRight:"clamp" });
  if (frame < fadeInEnd)        return interpolate(frame, [sceneIn,          fadeInEnd],     [1, 1], { extrapolateLeft:"clamp",  extrapolateRight:"clamp" });
  if (frame < fadeOutStart)     return 1;
  if (frame < sceneOut)         return interpolate(frame, [fadeOutStart,     sceneOut],      [1, 0], { extrapolateLeft:"clamp",  extrapolateRight:"clamp" });
  return 0;
}

type SceneEntry = {
  key: string;
  component: React.FC;
  sceneIn: number;
  sceneOut: number;
};

const SCENE_LIST: SceneEntry[] = [
  { key:"coldOpen",  component: Scene1ColdOpen,  sceneIn: SCENES.coldOpen.in,  sceneOut: SCENES.coldOpen.out  },
  { key:"problem",   component: Scene2Problem,   sceneIn: SCENES.problem.in,   sceneOut: SCENES.problem.out   },
  { key:"dashboard", component: Scene3Dashboard, sceneIn: SCENES.dashboard.in, sceneOut: SCENES.dashboard.out },
  { key:"aiAuto",    component: Scene4AI,         sceneIn: SCENES.aiAuto.in,    sceneOut: SCENES.aiAuto.out    },
  { key:"results",   component: Scene5Results,   sceneIn: SCENES.results.in,   sceneOut: SCENES.results.out   },
  { key:"design",    component: Scene6Design,    sceneIn: SCENES.design.in,    sceneOut: SCENES.design.out    },
  { key:"outro",     component: Scene7Outro,     sceneIn: SCENES.outro.in,     sceneOut: SCENES.outro.out     },
];

export const BrandArxVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden" }}>
      {SCENE_LIST.map(({ key, component: Scene, sceneIn, sceneOut }) => {
        // Only mount within a ±XFADE window of the scene
        const visible = frame >= sceneIn - XFADE && frame < sceneOut + XFADE;
        if (!visible) return null;
        const opacity = xfadeOpacity(frame, sceneIn, sceneOut, XFADE);
        return (
          <div
            key={key}
            style={{ position:"absolute", inset:0, opacity, willChange:"opacity" }}
          >
            <Scene />
          </div>
        );
      })}
    </div>
  );
};
