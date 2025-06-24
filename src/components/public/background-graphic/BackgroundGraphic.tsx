import React from "react";
import Image from "next/image";

const BackgroundGraphic = () => {
  return (
    <Image
      src={`http://${process.env.BLOB_HOST}/assets/vest-ic-background-graphic.gif`}
      alt="background-graphic"
      fill
      unoptimized
      priority
    />
  );
};

export default BackgroundGraphic;
