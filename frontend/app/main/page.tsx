'use client';

import { useRouter } from 'next/navigation';
import { mockAgent, STYLE_ICONS, getBrainLabel } from '@/lib/mock';

export default function Main() {
	const router = useRouter();
	const agent = mockAgent;
	const winRate =
		agent.stats.wins + agent.stats.losses > 0
			? Math.round(
					(agent.stats.wins / (agent.stats.wins + agent.stats.losses)) * 100,
				)
			: 0;

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				<h1 className="text-xl font-extrabold text-amber-500">A喜利</h1>
				<button
					type="button"
					onClick={() => router.push('/create')}
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
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</button>
			</div>

			{/* Profile card */}
			<div className="mx-5 mt-2 p-6 bg-gray-800 rounded-2xl">
				{/* Avatar */}
				<div className="flex justify-center mb-4">
					<div className="w-20 h-20 rounded-full bg-amber-500" />
				</div>

				{/* Name + Level */}
				<div className="flex items-center justify-center gap-2 mb-3">
					<h2 className="text-xl font-extrabold text-white">{agent.name}</h2>
					<span className="px-2.5 py-0.5 bg-amber-500 text-gray-900 text-xs font-bold rounded-full">
						Lv.{agent.level}
					</span>
				</div>

				{/* Style tag */}
				<div className="flex justify-center mb-3">
					<span className="inline-flex items-center gap-1.5 px-3 py-1 border border-amber-500/50 rounded-full text-sm text-amber-400">
						{STYLE_ICONS[agent.style]} {agent.style}
					</span>
				</div>

				{/* Brain status */}
				<p className="text-center text-gray-400 text-sm">
					🧠 脳みそ: {getBrainLabel(agent.level)}
				</p>
			</div>

			{/* Stats */}
			<div className="mx-5 mt-4 flex justify-around py-4">
				<div className="text-center">
					<p className="text-2xl font-extrabold text-amber-500">
						{agent.stats.wins}
					</p>
					<p className="text-gray-400 text-xs mt-1">勝利</p>
				</div>
				<div className="text-center">
					<p className="text-2xl font-extrabold text-white">
						{agent.stats.losses}
					</p>
					<p className="text-gray-400 text-xs mt-1">敗北</p>
				</div>
				<div className="text-center">
					<p className="text-2xl font-extrabold text-amber-400">{winRate}%</p>
					<p className="text-gray-400 text-xs mt-1">勝率</p>
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex-1 flex flex-col justify-end gap-3 px-5 pb-6">
				{/* Training */}
				<button
					type="button"
					onClick={() => router.push('/training')}
					className="flex items-center gap-4 w-full p-4 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors group"
				>
					<div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
						<svg
							aria-hidden="true"
							className="w-6 h-6 text-amber-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<div className="flex-1 text-left">
						<p className="text-white font-bold">修行する</p>
						<p className="text-gray-400 text-sm">
							お題に答えて脳みそを鍛えよう
						</p>
					</div>
					<svg
						aria-hidden="true"
						className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				{/* Battle */}
				<button
					type="button"
					onClick={() => router.push('/battle')}
					className="flex items-center gap-4 w-full p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl hover:bg-amber-500/20 transition-colors group"
				>
					<div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
						<svg
							aria-hidden="true"
							className="w-6 h-6 text-amber-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div className="flex-1 text-left">
						<p className="text-white font-bold">バトルする</p>
						<p className="text-gray-400 text-sm">
							AIエージェント同士で大喜利対決!
						</p>
					</div>
					<svg
						aria-hidden="true"
						className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			{/* Bottom nav */}
			<div className="flex items-center justify-around py-3 border-t border-gray-800">
				<button
					type="button"
					onClick={() => router.push('/main')}
					className="flex flex-col items-center gap-1 text-amber-500"
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
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
						/>
					</svg>
					<span className="text-[10px]">ホーム</span>
				</button>
				<button
					type="button"
					onClick={() => router.push('/battle')}
					className="flex flex-col items-center gap-1 text-gray-500 hover:text-amber-500 transition-colors"
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
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span className="text-[10px]">バトル</span>
				</button>
			</div>
		</div>
	);
}
