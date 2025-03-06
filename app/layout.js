import { Montserrat } from "next/font/google";
import "./globals.css";
import Provider from "./providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Adjust weights as needed
});

export const metadata = {
  title: "Infil",
  description: "Studi struktur anatomi manusia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  );
}
