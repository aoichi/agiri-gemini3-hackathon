'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Splash() {
	const router = useRouter();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(true);
		const timer = setTimeout(() => {
			// TODO: Firebase Auth signInAnonymously() → getAgent(uid)
			// true = agent存在 → /main, false = 未作成 → /create
			const hasAgent = true;
			router.push(hasAgent ? '/main' : '/create');
		}, 2500);
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-6">
			<div
				className={`transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
			>
				{/* Logo icon */}
				<div className="flex justify-center mb-6">
					<div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center">
						<svg
							aria-hidden="true"
							viewBox="0 0 100 100"
							className="w-16 h-16 text-amber-500"
							fill="currentColor"
						>
							<circle cx="35" cy="40" r="5" />
							<circle cx="65" cy="40" r="5" />
							<path
								d="M 30 60 Q 50 80 70 60"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								strokeLinecap="round"
							/>
							<line
								x1="25"
								y1="55"
								x2="20"
								y2="50"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
							/>
							<line
								x1="75"
								y1="55"
								x2="80"
								y2="50"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
							/>
						</svg>
					</div>
				</div>

				{/* Title */}
				<h1 className="text-4xl font-extrabold text-amber-500 text-center text-shadow-glow">
					A喜利
				</h1>

				{/* Subtitle */}
				<p className="text-gray-400 text-center mt-2 text-sm">
					AI大喜利バトル
				</p>

				{/* Loading dots */}
				<div className="flex justify-center gap-2 mt-8">
					<div className="w-3 h-3 rounded-full bg-amber-500 animate-dot-pulse" />
					<div className="w-3 h-3 rounded-full bg-amber-600 animate-dot-pulse delay-100" />
					<div className="w-3 h-3 rounded-full bg-gray-600 animate-dot-pulse delay-200" />
				</div>
			</div>
		</div>
	);
}
