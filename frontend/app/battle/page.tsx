'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Battle } from '@agiri/shared';
import {
	mockAgent,
	mockOpponent,
	mockRunBattle,
	mockBattleStatusSequence,
} from '@/lib/mock';

type Phase = 'ready' | 'battling' | 'done';

export default function BattlePage() {
	const router = useRouter();
	const [phase, setPhase] = useState<Phase>('ready');
	const [battleState, setBattleState] = useState<Partial<Battle> | null>(null);

	const handleStart = useCallback(async () => {
		setPhase('battling');
		const { battleId } = await mockRunBattle();

		const cleanup = mockBattleStatusSequence((update) => {
			setBattleState(update);
			if (update.status === 'done') {
				setPhase('done');
				setTimeout(() => {
					router.push(`/battle/result/${battleId}`);
				}, 1500);
			}
		});

		return cleanup;
	}, [router]);

	const getRoundStatus = (roundNum: number) => {
		if (!battleState?.rounds) return 'pending';
		const round = battleState.rounds.find((r) => r.roundNumber === roundNum);
		if (round) return 'done';
		if (battleState.status === 'processing') {
			if (roundNum === 1) return 'thinking';
			return 'pending';
		}
		if (battleState.status === 'round1_done' && roundNum === 2)
			return 'thinking';
		return 'pending';
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				<button
					type="button"
					onClick={() => router.push('/main')}
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
				<h1 className="text-lg font-bold text-white">バトル</h1>
				<div className="w-6" />
			</div>

			{/* VS Display - centered vertically */}
			<div className="flex-1 flex flex-col justify-center">
				<div className="flex items-center justify-center gap-4 px-5">
					{/* Player */}
					<div className="flex flex-col items-center">
						<div className="w-20 h-20 rounded-full bg-amber-500 mb-2" />
						<p className="text-white font-bold text-sm text-center leading-tight">
							{mockAgent.name}
						</p>
						<p className="text-amber-500 text-xs font-bold">
							Lv.{mockAgent.level}
						</p>
					</div>

					{/* VS */}
					<span className="text-3xl font-extrabold text-white -mt-6">VS</span>

					{/* Opponent */}
					<div className="flex flex-col items-center">
						<div className="w-20 h-20 rounded-full bg-gray-500 mb-2" />
						<p className="text-white font-bold text-sm text-center leading-tight">
							{mockOpponent.name}
						</p>
						<p className="text-gray-400 text-xs font-bold">
							Lv.{mockOpponent.level}
						</p>
					</div>
				</div>

				{/* Battle progress - centered */}
				{phase !== 'ready' && (
					<div className="px-5 mt-8 animate-fade-in">
						<p className="text-gray-300 font-bold text-sm mb-4">
							{phase === 'done' ? 'バトル終了!' : 'ラウンド進行中...'}
						</p>

						{[1, 2].map((roundNum) => {
							const status = getRoundStatus(roundNum);
							const round = battleState?.rounds?.find(
								(r) => r.roundNumber === roundNum,
							);

							return (
								<div
									key={roundNum}
									className={`mb-4 p-4 rounded-2xl border transition-all duration-500 ${
										status === 'done'
											? 'bg-gray-800 border-amber-500/50'
											: status === 'thinking'
												? 'bg-gray-800/60 border-gray-600'
												: 'bg-gray-800/30 border-gray-700'
									}`}
								>
									<div className="flex items-center justify-between mb-2">
										<span
											className={`font-bold text-sm ${status === 'done' ? 'text-amber-500' : 'text-gray-400'}`}
										>
											ROUND {roundNum}
										</span>
										{status === 'done' && (
											<span className="text-green-400 text-lg">✓</span>
										)}
										{status === 'thinking' && (
											<span className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
										)}
										{status === 'pending' && (
											<span className="text-gray-600 text-lg">○</span>
										)}
									</div>

									{status === 'thinking' && (
										<p className="text-gray-500 text-sm">思考中...</p>
									)}

									{status === 'done' && round && (
										<div className="animate-fade-in">
											<p className="text-gray-300 text-sm">
												<span className="text-amber-500/70 mr-1">🔍</span>「
												{round.results[0]?.intermediateThought}」
											</p>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Start button - pinned to bottom above nav */}
			{phase === 'ready' && (
				<div className="px-5 pb-4">
					<button
						type="button"
						onClick={handleStart}
						className="w-full py-4 rounded-full bg-amber-500 text-gray-900 text-lg font-bold hover:bg-amber-400 active:scale-[0.98] transition-all"
					>
						バトル開始!
					</button>
				</div>
			)}

			{/* Bottom nav */}
			<div className="flex items-center justify-around py-3 border-t border-gray-800">
				<button
					type="button"
					onClick={() => router.push('/main')}
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
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
						/>
					</svg>
					<span className="text-[10px]">ホーム</span>
				</button>
				<button
					type="button"
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
