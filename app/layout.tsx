import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "EZ Matrix Calculator",
	description: "Calculaza matricile la puterea aleasa si matricea drumurilor.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="bg-[#eeee]">
			<body>{children}</body>
		</html>
	);
}
