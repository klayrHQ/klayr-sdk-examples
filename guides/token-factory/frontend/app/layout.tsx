import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Box, CssBaseline } from '@mui/material';
import { Header } from '@/components/layout/header';
import { ProviderStructure } from '@/providers/providerStructure';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token Factory",
  description: "Create your own tokens on the Klayr blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} color-theme={"light"}>
        <ProviderStructure>
          <CssBaseline />
          <div className="App">
            <Header/>
            <Box component={"div"} sx={{padding: "50px 0px"}}>
              {children}
            </Box>
          </div>
        </ProviderStructure>
      </body>
    </html>
  );
}
