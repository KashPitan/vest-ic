"use client";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useThree, useFrame } from "@react-three/fiber";

export default function Gradient() {
  return (
    <ShaderGradientCanvas
      pixelDensity={2}
      fov={40}
      style={{
        width: "100vw",
        height: "100dvh",
        maxWidth: "100%",
        // max width needed to prevent scrollbars
      }}
    >
      <ShadGradient />
    </ShaderGradientCanvas>
  );
}

function ShadGradient() {
  const { scene } = useThree();

  useFrame(() => {
    const mesh: any = scene.getObjectByName("shadergradient-mesh");
    if (mesh.material.userData.uNoiseStrength) {
      mesh.material.userData.uNoiseStrength.value = 10;
    }
  });

  return (
    <ShaderGradient
      zoomOut={false}
      cameraZoom={1}
      cDistance={4}
      grain="on"
      color1="#0B2B1C"
      color2="#F59D1C"
      color3="#155436"
      type="waterPlane"
      shader="a"
      uSpeed={0.04}
      uDensity={2}
      brightness={1.3}
    />
  );
}
