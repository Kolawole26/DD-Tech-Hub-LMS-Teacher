// src/app/layout.js
import { Poppins } from "next/font/google";
import '@/styles/globals.css';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for course management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}