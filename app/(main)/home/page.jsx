"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import human from "../../../public/images/human.png";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState(null);

  const handlePartClick = (id) => {
    setSelectedPart(id);
    router.push(`/module/${id}`);
  };

  return (
    <div className="h-screen bg-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Mau belajar apa hari ini?
        </h1>
        <p className="text-blue-800 mb-8">
          Klik bagian tubuh yang ingin kamu ketahui
        </p>

        <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg p-4">
          {/* Interactive body map */}
          <div className="relative w-full h-full">
            <Image
              src={human}
              alt="Human Anatomy Model"
              layout="fill"
              objectFit="contain"
            />
            {/* Clickable areas */}
            <div
              className="absolute cursor-pointer hover:opacity-75 transition-opacity w-4 h-4"
              style={{
                top: "20%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handlePartClick("cm7wgoh200003so68hm7tnyly")}
            >
              {/* Head region */}
            </div>
            {/* Add more clickable regions */}
          </div>
        </div>
      </div>
    </div>
  );
}
