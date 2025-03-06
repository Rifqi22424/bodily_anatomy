"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../components/sidebar";
import human_skin from "../../../public/images/human_skin.png";
import { useAuth } from "../../contexts/auth_context";
import { motion } from "framer-motion";

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();
  const [clickableAreas, setClickableAreas] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredModule, setHoveredModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        console.log(token);
        const res = await fetch("/api/module", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch modules");
        const data = await res.json();
        
        // Remove duplicates by title
        const uniqueModules = data.reduce((acc, current) => {
          const x = acc.find(item => item.title === current.title);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        
        setClickableAreas(uniqueModules);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [token]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCursorPosition({ x, y });
  };

  const handlePartClick = (id) => {
    router.push(`/module/${id}`);
  };

  const handleModuleHover = (module) => {
    setHoveredModule(module);
  };

  const handleModuleLeave = () => {
    setHoveredModule(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
      <Sidebar />

      <main className="md:ml-64 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">
              Mau belajar apa hari ini?
            </h1>
            <p className="text-blue-800 mb-8 text-center">
              Arahkan kursor ke bagian tubuh yang ingin kamu ketahui
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
            {/* Human body image and interactive points */}
            <motion.div
              className="relative w-fit h-fit bg-white rounded-lg shadow-lg overflow-hidden"
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isLoading ? (
                <div className="w-400 h-600 bg-gray-100 animate-pulse flex items-center justify-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : (
                <>
                  <Image
                    src={human_skin}
                    alt="Human Anatomy Model"
                    width={400}
                    height={600}
                    priority
                    className="transition-all duration-300"
                  />

                  {/* Coordinates display (for development) */}
                  <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full opacity-70">
                    X: {cursorPosition.x}, Y: {cursorPosition.y}
                  </div>

                  {/* Interactive points */}
                  {clickableAreas.map((area) => (
                    <motion.div
                      key={area.id}
                      className="absolute cursor-pointer transition-all transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: `${(area.y / 600) * 100}%`,
                        left: `${(area.x / 400) * 100}%`,
                      }}
                      onClick={() => handlePartClick(area.id)}
                      onMouseEnter={() => handleModuleHover(area)}
                      onMouseLeave={handleModuleLeave}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500 bg-opacity-70 hover:bg-opacity-90 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {area.title.charAt(0)}
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping" />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>

            {/* Module information panel */}
            <motion.div
              className="w-full md:w-96 h-96 bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {hoveredModule ? (
                <motion.div
                  className="p-4 h-full flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-40 w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={hoveredModule.outsideImageUrl}
                      alt={hoveredModule.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <h2 className="absolute bottom-3 left-3 text-white font-bold text-xl drop-shadow-md">
                      {hoveredModule.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-700 overflow-y-auto flex-grow text-sm">
                    {hoveredModule.description}
                  </p>
                  
                  <button 
                    onClick={() => handlePartClick(hoveredModule.id)}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors shadow-md"
                  >
                    Pelajari Lebih Lanjut
                  </button>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Informasi Modul</h3>
                  <p className="text-gray-600 text-sm">
                    Arahkan kursor ke salah satu titik pada gambar untuk melihat informasi detail bagian tubuh tersebut.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Module grid preview */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">Semua Modul Pembelajaran</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {clickableAreas.map((area) => (
                <motion.div
                  key={area.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePartClick(area.id)}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-32">
                    <Image
                      src={area.outsideImageUrl}
                      alt={area.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-blue-800">{area.title}</h3>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{area.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}