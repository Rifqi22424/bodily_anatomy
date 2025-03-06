"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../components/sidebar";
import human_skin from "../../../public/images/human_skin.png";
import { useAuth } from "../../contexts/auth_context";

export default function CreateModule() {
  const { token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    x: 0,
    y: 0,
  });
  const [outsideImage, setOutsideImage] = useState(null);
  const [insideImage, setInsideImage] = useState(null);
  const [outsideImagePreview, setOutsideImagePreview] = useState(null);
  const [insideImagePreview, setInsideImagePreview] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const outsideImageRef = useRef(null);
  const insideImageRef = useRef(null);

  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("/api/module", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch modules");
        }

        const data = await res.json();
        setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, [token, success, deleteSuccess]); // Refetch when module is created or deleted

  // Add this function to handle module deletion
  const handleDeleteModule = async () => {
    if (!selectedModuleId) {
      setDeleteError("Pilih module untuk dihapus");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      const res = await fetch("/api/module", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: selectedModuleId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete module");
      }

      setDeleteSuccess("Module berhasil dihapus!");
      setSelectedModuleId("");
    } catch (error) {
      console.error("Error deleting module:", error);
      setDeleteError("Gagal menghapus module. Silakan coba lagi.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update file state
    if (type === "outside") {
      setOutsideImage(file);
      setOutsideImagePreview(URL.createObjectURL(file));
    } else {
      setInsideImage(file);
      setInsideImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCursorPosition({ x, y });
  };

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    setFormData((prev) => ({ ...prev, x, y }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.content ||
      !outsideImage ||
      !insideImage
    ) {
      setError("Semua field harus diisi");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("content", formData.content);
      data.append("x", formData.x);
      data.append("y", formData.y);
      data.append("outsideImage", outsideImage);
      data.append("insideImage", insideImage);

      const res = await fetch("/api/module", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to create module");
      }

      setSuccess("Module berhasil dibuat!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        content: "",
        x: 0,
        y: 0,
      });
      setOutsideImage(null);
      setInsideImage(null);
      setOutsideImagePreview(null);
      setInsideImagePreview(null);

      // Redirect after short delay
    } catch (error) {
      console.error("Error creating module:", error);
      setError("Gagal membuat module. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-blue-200">
      <Sidebar />

      <main className="md:ml-64 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Buat Module Baru
          </h1>
          <p className="text-blue-800 mb-8">
            Tambahkan modul pembelajaran baru ke sistem
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">
                Form Module
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Judul Module
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul module"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="description"
                  >
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Tuliskan deskripsi singkat tentang module ini"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="content">
                    Konten Module
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
                    placeholder="Tuliskan konten module lengkap di sini"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Gambar Luar
                    </label>
                    <input
                      type="file"
                      ref={outsideImageRef}
                      onChange={(e) => handleImageChange(e, "outside")}
                      className="hidden"
                      accept="image/*"
                    />
                    <div
                      onClick={() => outsideImageRef.current.click()}
                      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {outsideImagePreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={outsideImagePreview}
                            alt="Outside Image Preview"
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            Upload gambar luar
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Gambar Dalam
                    </label>
                    <input
                      type="file"
                      ref={insideImageRef}
                      onChange={(e) => handleImageChange(e, "inside")}
                      className="hidden"
                      accept="image/*"
                    />
                    <div
                      onClick={() => insideImageRef.current.click()}
                      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {insideImagePreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={insideImagePreview}
                            alt="Inside Image Preview"
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            Upload gambar dalam
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="x">
                      Posisi X
                    </label>
                    <input
                      type="number"
                      id="x"
                      name="x"
                      value={formData.x}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="y">
                      Posisi Y
                    </label>
                    <input
                      type="number"
                      id="y"
                      name="y"
                      value={formData.y}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Menyimpan..." : "Simpan Module"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">
                Pilih Posisi
              </h2>
              <p className="text-gray-600 mb-4">
                Klik pada gambar untuk menentukan posisi titik (nilai X dan Y)
              </p>

              <div
                className="relative w-fit h-fit mx-auto border rounded"
                onMouseMove={handleMouseMove}
                onClick={handleImageClick}
              >
                <Image
                  src={human_skin}
                  alt="Human Anatomy Model"
                  width={400}
                  height={600}
                  priority
                />

                {/* Display cursor position */}
                <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-sm px-2 py-1 rounded">
                  X: {cursorPosition.x}, Y: {cursorPosition.y}
                </div>

                {/* Display selected position */}
                {formData.x > 0 || formData.y > 0 ? (
                  <div
                    className="absolute w-4 h-4 rounded-full bg-red-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: formData.y,
                      left: formData.x,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" />
                  </div>
                ) : null}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Posisi yang dipilih:
                </h3>
                <p className="text-gray-700">
                  X: <span className="font-semibold">{formData.x}</span>, Y:{" "}
                  <span className="font-semibold">{formData.y}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Add this section below the grid in your return statement */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Hapus Module
            </h2>

            {deleteError && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                {deleteError}
              </div>
            )}

            {deleteSuccess && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                {deleteSuccess}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="moduleToDelete"
                >
                  Pilih Module untuk Dihapus
                </label>
                <select
                  id="moduleToDelete"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                >
                  <option value="">-- Pilih Module --</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleDeleteModule}
                disabled={deleteLoading || !selectedModuleId}
                className={`md:w-auto w-full py-3 px-6 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors ${
                  deleteLoading || !selectedModuleId
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {deleteLoading ? "Menghapus..." : "Hapus Module"}
              </button>
            </div>

            {modules.length === 0 && (
              <p className="mt-4 text-gray-600 italic">
                Tidak ada module yang tersedia untuk dihapus.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
