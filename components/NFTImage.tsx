"use client";

import Image from "next/image";
import { useState } from "react";

interface NFTImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function NFTImage({ src, alt, className = "" }: NFTImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-4xl">🎮</div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageSrc("/placeholder-nft.png");
          setIsLoading(false);
        }}
        unoptimized={imageSrc === "/placeholder-nft.png"}
      />
    </>
  );
}
