import { Inter } from 'next/font/google'
import type { Metadata } from "next";

import { DeepgramContextProvider } from "./conversation/[conversation_id]/components/context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "./conversation/[conversation_id]/components/context/MicrophoneContextProvider";
import "./globals.css";
import { Providers } from "./StoreProvider";
import { ToasterProvider } from './component/ToasterProvider';

export const metadata: Metadata = {
  title: "PollVault",
  description: "Revolutionanizing the survey !",
  icons: {
    icon: "/logo.svg", // Add custom logo icon to the website.
  },
};

 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`font-inter text-Pri-Dark ${inter.className}`}>
      <body>
        <Providers>
          <MicrophoneContextProvider>
            <DeepgramContextProvider>
        <ToasterProvider>
              {children}
          </ToasterProvider>
              </DeepgramContextProvider>
          </MicrophoneContextProvider>
        </Providers>
      </body>
    </html>
  );
}
