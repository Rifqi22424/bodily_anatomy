"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import heart from "../public/images/heart.png";
import human from "../public/images/human.png";
import animation_ornament from "../public/images/animation_ornament.png";
import module_ornament from "../public/images/module_ornament.png";
import quiz_ornament from "../public/images/quiz_ornament.png";

export default function Landing() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300">
      <Head>
        <title>INFIL - Studi Anatomi Interaktif</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white py-4 px-6 shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-800">INFIL</div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="text-blue-800 hover:text-blue-600 transition-colors"
                >
                  BERANDA
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-800 hover:text-blue-600 transition-colors"
                >
                  TENTANG
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-800 hover:text-blue-600 transition-colors"
                >
                  KONTAK
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-800 hover:text-blue-600 transition-colors"
                >
                  BANTUAN
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-800 hover:text-blue-600 transition-colors"
                >
                  DAFTAR
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors"
                >
                  MASUK
                </a>
              </li>
            </ul>
          </nav>
          <button className="md:hidden text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around">
            <div className="md:w-1/2 mb-10 md:mb-0" data-aos="fade-right">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                Studi struktur anatomi manusia secara ringkas dan efektif dengan
                INFIL
              </h1>
              <p className="text-blue-800 mb-8 text-lg">
                Pelajari anatomi manusia dan gejala dengan video interaktif
                mudah di aplikasi terstruktur dan terpercaya untuk memahami
                anatomi manusia.
              </p>
              <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-500 transition-colors transform hover:scale-105">
                Registrasi sekarang
              </button>
            </div>
            <div className="" data-aos="fade-left">
              <Image
                src={heart}
                alt="Heart Anatomy"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
              Pelajari anatomi dengan lebih mudah dan interaktif!
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-evenly">
              <div className="max-w-1/2">
                <p className="text-blue-800 mb-6 text-lg">
                  Manfaatkan pengalaman Anda melalui pembelajaran interaktif
                  tentang anatomi tubuh yang dirancang khusus untuk membuat
                  pemahaman menjadi lebih menyenangkan dan mendalam.
                </p>
                <p className="text-blue-800 md:mb-0 mb-6 text-lg">
                  Jelajahi setiap bagian tubuh, mulai dari sistem otot hingga
                  organ dalam, dengan visualisasi 3D yang menarik dan detail
                  secara akurat. Uji pemahaman Anda melalui kuis interaktif dan
                  kuis yang dirancang untuk memperkuat ingatan dan memfasilitasi
                  pembelajaran.
                </p>
              </div>
              <Image
                src={human}
                alt="Heart Anatomy"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-blue-100 text-center">
          <div className="max-w-7xl mx-auto" data-aos="zoom-in">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
              DAFTAR SEKARANG JUGA
            </h2>
            <p className="text-blue-800 mb-10 max-w-3xl mx-auto text-lg">
              Bergabunglah bersama kami untuk mendapatkan pengalaman belajar
              yang menarik untuk mendapatkan akses penuh ke pengalaman belajar
              anatomi yang menyenangkan dan interaktif! Jangan lewatkan
              kesempatan ini!
            </p>
            <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-500 transition-colors transform hover:scale-105">
              Registrasi sekarang
            </button>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center"
              data-aos="fade-up"
            >
              Fitur Unggulan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div
                className="bg-blue-50 p-8 rounded-xl shadow-lg"
                data-aos="flip-left"
                data-aos-delay="100"
              >
                <Image
                  src={module_ornament}
                  alt="Anatomy Topic"
                  width={200}
                  height={200}
                  className="mb-6 mx-auto"
                />
                <h3 className="text-xl font-semibold text-blue-900 mb-4 text-center">
                  Modul topik pelajaran anatomi
                </h3>
                <p className="text-blue-800 text-center">
                  Pelajari anatomi manusia melalui modul-modul terstruktur dan
                  komprehensif.
                </p>
              </div>
              <div
                className="bg-blue-50 p-8 rounded-xl shadow-lg"
                data-aos="flip-left"
                data-aos-delay="200"
              >
                <Image
                  src={animation_ornament}
                  alt="2D Animation"
                  width={200}
                  height={200}
                  className="mb-6 mx-auto"
                />
                <h3 className="text-xl font-semibold text-blue-900 mb-4 text-center">
                  Animasi 2D
                </h3>
                <p className="text-blue-800 text-center">
                  Visualisasi menarik untuk memudahkan pemahaman konsep anatomi
                  yang kompleks.
                </p>
              </div>
              <div
                className="bg-blue-50 p-8 rounded-xl shadow-lg"
                data-aos="flip-left"
                data-aos-delay="300"
              >
                <Image
                  src={quiz_ornament}
                  alt="Website Features"
                  width={200}
                  height={200}
                  className="mb-6 mx-auto"
                />
                <h3 className="text-xl font-semibold text-blue-900 mb-4 text-center">
                  Fitur interaktif website
                </h3>
                <p className="text-blue-800 text-center">
                  Akses berbagai fitur interaktif untuk meningkatkan pengalaman
                  belajar Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-blue-100">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center"
              data-aos="fade-up"
            >
              Pengalaman dan Masukan
            </h2>
            <p
              className="text-blue-800 mb-10 text-center text-lg"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Berikan pengalaman dan masukan terbaik Anda untuk kami!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div data-aos="fade-right">
                <label
                  htmlFor="experience"
                  className="block text-blue-900 mb-2 font-semibold"
                >
                  Pengalaman
                </label>
                <textarea
                  id="experience"
                  className="w-full p-4 rounded-lg shadow-inner"
                  rows="4"
                  placeholder="Ceritakan pengalaman Anda..."
                ></textarea>
              </div>
              <div data-aos="fade-left">
                <label
                  htmlFor="feedback"
                  className="block text-blue-900 mb-2 font-semibold"
                >
                  Masukan
                </label>
                <textarea
                  id="feedback"
                  className="w-full p-4 rounded-lg shadow-inner"
                  rows="4"
                  placeholder="Berikan saran Anda..."
                ></textarea>
              </div>
            </div>
            <div className="text-center mt-10">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                data-aos="zoom-in"
              >
                Kirim Feedback
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-800 py-10 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-2xl font-bold mb-4 md:mb-0">INFIL</div>
            <nav>
              <ul className="flex flex-wrap justify-center space-x-6">
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    JOBS
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    DEVELOPERS
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    TERMS
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    PRIVACY POLICY
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex justify-center space-x-6 mb-8">
            {/* Add social media icons here */}
            <a
              href="#"
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="#"
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <p className="text-center text-sm">
            © 2023 INFIL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
