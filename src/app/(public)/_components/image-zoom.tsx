"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useRef } from "react";
import AppImage from "../../../../public/app.webp";

export default function ImageZoom() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0.1, 1], [1, 3]);

  return (
    <div ref={container} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen">
        <div className="w-full h-full absolute top-0 flex items-center justify-center">
          <motion.div
            style={{ scale: scale4 }}
            className="w-[25vw] h-[25vh] relative"
          >
            <Image
              src={AppImage}
              fill
              alt="image"
              placeholder="blur"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
