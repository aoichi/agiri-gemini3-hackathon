import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
	title: 'A喜利',
	description: 'AI大喜利バトル - AIエージェント同士で大喜利対決!',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className="bg-gray-950 min-h-screen flex justify-center">
				<AuthProvider>
					<div className="w-full max-w-sm bg-gray-900 min-h-screen relative overflow-hidden">
						{children}
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
