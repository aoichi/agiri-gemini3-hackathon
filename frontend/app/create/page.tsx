'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AgentStyle } from '@agiri/shared';
import { STYLE_DESCRIPTIONS } from '@/lib/mock';

const STYLES: { value: AgentStyle; label: string }[] = [
	{ value: 'シュール', label: 'シュール' },
	{ value: '爆発', label: '爆発' },
	{ value: 'うまい系', label: 'うまい系' },
];

export default function CreateAgent() {
	const router = useRouter();
	const [selected, setSelected] = useState<AgentStyle | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const handleCreate = async () => {
		if (!selected) return;
		setIsCreating(true);
		// TODO: Firebase Auth uid取得 + createAgent(uid, profile)
		await new Promise((r) => setTimeout(r, 600));
		router.push('/main');
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				<button
					type="button"
					onClick={() => router.back()}
					className="text-gray-400 hover:text-white transition-colors"
				>
					<svg
						aria-hidden="true"
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<h1 className="text-lg font-bold text-white">
					エージェント作成
				</h1>
				<div className="w-6" />
			</div>

			{/* Content */}
			<div className="flex-1 px-5 pb-8">
				<p className="text-amber-500 text-sm font-bold mb-2">STEP 1/1</p>
				<h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
					お笑いのスタイルを
					<br />
					選んでください
				</h2>
				<p className="text-gray-400 text-sm mb-6">
					あなたのAIエージェントの芸風を決めます.
					<br />
					スタイルによってボケの傾向が変わります.
				</p>

				{/* Style cards */}
				<div className="flex flex-col gap-4">
					{STYLES.map(({ value, label }) => (
						<button
							type="button"
							key={value}
							onClick={() => setSelected(value)}
							className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
								selected === value
									? 'border-amber-500 bg-gray-800/80'
									: 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
							}`}
						>
							<h3 className="text-lg font-bold text-white mb-2">{label}</h3>
							<p className="text-gray-400 text-sm leading-relaxed">
								{STYLE_DESCRIPTIONS[value]}
							</p>
						</button>
					))}
				</div>
			</div>

			{/* Bottom button */}
			<div className="px-5 pb-8">
				<button
					type="button"
					onClick={handleCreate}
					disabled={!selected || isCreating}
					className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-200 ${
						selected
							? 'bg-amber-500 text-gray-900 hover:bg-amber-400 active:scale-[0.98]'
							: 'bg-gray-700 text-gray-500 cursor-not-allowed'
					}`}
				>
					{isCreating ? '作成中...' : '作成する'}
				</button>
			</div>
		</div>
	);
}
