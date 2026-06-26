import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import { AuthProvider } from "@/context/AuthContext";
import ReactQueryProvider from "@/context/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NaxusAI",
  description: "AI-powered platform by NaxusAI",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      
        <ReactQueryProvider>
          <AuthProvider>
            <Navbar/>
          
         <main className="flex-1">
           {children}
         </main>
          
          <Footer/>
          </AuthProvider>
        </ReactQueryProvider>
      
      </body>
    </html>
  );
}
