"use client";

import { useState } from "react";
import { Menu, X, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth_context";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { logout, role } = useAuth();

  let menuItems = [
    { title: "Home", href: "/home" },
    { title: "Laporan Belajar", href: "/quiz/result" },
    { title: "Keluar", action: () => setIsModalOpen(true) },
  ];

  if (role === "ADMIN") {
    menuItems = [
      ...menuItems,
      { title: "Kelola Modul", href: "/admin/module" },
      { title: "Kelola Quiz", href: "/admin/quiz" },
    ];
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 text-blue-900 cursor-pointer"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-200 w-64 z-40 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4">
          <div className="flex justify-end md:justify-self-start items-center mb-8 ">
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-blue-900 cursor-pointer"
            >
              <X size={24} />
            </button>
            {/* <button
              className="text-blue-900 hidden md:block cursor-pointer"
              onClick={() => router.push("/")}
            >
              <ChevronLeft size={24} />
            </button> */}
          </div>

          <div className="mb-8 cursor-pointer" onClick={() => router.push("/home")}>
            <h2 className="text-xl font-semibold text-blue-900 mb-2">INFIL</h2>
            {/* <p className="text-sm text-blue-800">Alamat email anda</p> */}
          </div>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.title}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block py-2 px-4 rounded bg-white text-blue-900 hover:bg-blue-100 transition-colors"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <button
                      onClick={item.action}
                      className="w-full text-left py-2 px-4 rounded bg-red-400 text-white hover:bg-red-500 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal Logout */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Konfirmasi Keluar
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer"
                onClick={() => {
                  logout(); // Panggil fungsi logout
                  setIsModalOpen(false);
                }}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
