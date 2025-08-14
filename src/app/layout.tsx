import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sort It Out!: Interactive Sorting Algorithm Visualization",
  description: "An interactive way to visualize sorting algorithms. Select an algorithm like Bubble Sort, Merge Sort, or Quick Sort, generate an array, and watch it get sorted step-by-step.",
  keywords: ["sorting algorithm", "visualization", "bubble sort", "selection sort", "insertion sort", "merge sort", "quick sort", "computer science", "education", "visual learning"],
  openGraph: {
    title: "Sort It Out!: Interactive Sorting Algorithm Visualization",
    description: "Watch sorting algorithms in action! An interactive tool for students and developers.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sort It Out! Application Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sort It Out!: Interactive Sorting Algorithm Visualization",
    description: "Watch sorting algorithms in action! An interactive tool for students and developers.",
    images: ["/og-image.png"],
  },
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
