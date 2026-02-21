import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'A喜利',
	description: 'AIエージェント大喜利バトル',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className="bg-gray-950 min-h-screen flex justify-center">
				<div className="w-full max-w-sm bg-gray-900 min-h-screen relative">
					{children}
				</div>
			</body>
		</html>
	);
}
