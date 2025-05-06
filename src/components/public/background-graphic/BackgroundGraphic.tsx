import React from "react";
import Image from "next/image";
import vestIcBackgroundGif from "./vest-ic-background-graphic.gif";

const BackgroundGraphic = () => {
  return (
    <Image
      src={vestIcBackgroundGif}
      alt="background-graphic"
      fill
      unoptimized
      priority
    />
  );
};

export default BackgroundGraphic;
