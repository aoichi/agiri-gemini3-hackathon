"use client";

import type { Battle } from "@agiri/shared";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import FluentEmoji from "@/components/FluentEmoji";
import {
	mockAgent,
	mockBattleStatusSequence,
	mockOpponent,
	mockRunBattle,
	STYLE_FACE,
} from "@/lib/mock";

type Phase = "ready" | "battling" | "done";

export default function BattlePage() {
	const router = useRouter();
	const [phase, setPhase] = useState<Phase>("ready");
	const [battleState, setBattleState] = useState<Partial<Battle> | null>(null);

	const handleStart = useCallback(async () => {
		setPhase("battling");
		const { battleId } = await mockRunBattle();

		const cleanup = mockBattleStatusSequence((update) => {
			setBattleState(update);
			if (update.status === "done") {
				setPhase("done");
				setTimeout(() => {
					router.push(`/battle/result/${battleId}`);
				}, 1500);
			}
		});

		return cleanup;
	}, [router]);

	const getRoundStatus = (roundNum: number) => {
		if (!battleState?.rounds) return "pending";
		const round = battleState.rounds.find((r) => r.roundNumber === roundNum);
		if (round) return "done";
		if (battleState.status === "processing") {
			if (roundNum === 1) return "thinking";
			return "pending";
		}
		if (battleState.status === "round1_done" && roundNum === 2)
			return "thinking";
		return "pending";
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				<button
					type="button"
					onClick={() => router.push("/main")}
					className="opacity-70 hover:opacity-100 transition-opacity"
				>
					<FluentEmoji name="back-arrow" size={26} />
				</button>
				<h1 className="text-lg font-bold text-white">バトル</h1>
				<div className="w-6" />
			</div>

			{/* VS Display - centered vertically */}
			<div className="flex-1 flex flex-col justify-center">
				<div className="flex items-center justify-center gap-4 px-5">
					{/* Player */}
					<div className="flex flex-col items-center">
						<div className="mb-2">
							<FluentEmoji name={STYLE_FACE[mockAgent.style]} size={80} />
						</div>
						<p className="text-white font-bold text-sm text-center leading-tight">
							{mockAgent.name}
						</p>
						<p className="text-amber-500 text-xs font-bold mt-2">
							Lv.{mockAgent.level}
						</p>
					</div>

					{/* VS */}
					<span className="text-3xl font-extrabold text-white -mt-6">VS</span>

					{/* Opponent */}
					<div className="flex flex-col items-center">
						<div className="mb-2">
							<FluentEmoji name={STYLE_FACE[mockOpponent.style]} size={80} />
						</div>
						<p className="text-white font-bold text-sm text-center leading-tight">
							{mockOpponent.name}
						</p>
						<p className="text-gray-400 text-xs font-bold mt-2">
							Lv.{mockOpponent.level}
						</p>
					</div>
				</div>

				{/* Battle progress - centered */}
				{phase !== "ready" && (
					<div className="px-5 mt-8 animate-fade-in">
						<p className="text-gray-300 font-bold text-sm mb-4">
							{phase === "done" ? "バトル終了!" : "ラウンド進行中..."}
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
										status === "done"
											? "bg-gray-800 border-amber-500/50"
											: status === "thinking"
												? "bg-gray-800/60 border-gray-600"
												: "bg-gray-800/30 border-gray-700"
									}`}
								>
									<div className="flex items-center justify-between mb-2">
										<span
											className={`font-bold text-sm ${status === "done" ? "text-amber-500" : "text-gray-400"}`}
										>
											ROUND {roundNum}
										</span>
										{status === "done" && (
											<span className="text-green-400 text-lg">✓</span>
										)}
										{status === "thinking" && (
											<span className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
										)}
										{status === "pending" && (
											<span className="text-gray-600 text-lg">○</span>
										)}
									</div>

									{status === "thinking" && (
										<p className="text-gray-500 text-sm">思考中...</p>
									)}

									{status === "done" && round && (
										<div className="animate-fade-in">
											<p className="text-gray-300 text-sm flex items-center gap-1">
												<FluentEmoji
													name="magnifying-glass-tilted-left"
													size={16}
												/>
												「{round.results[0]?.intermediateThought}」
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
			{phase === "ready" && (
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
					onClick={() => router.push("/main")}
					className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
				>
					<FluentEmoji name="house" size={28} />
					<span className="text-[10px] text-gray-400">ホーム</span>
				</button>
				<button type="button" className="flex flex-col items-center gap-1">
					<FluentEmoji name="crossed-swords" size={28} />
					<span className="text-[10px] text-amber-500">バトル</span>
				</button>
			</div>
		</div>
	);
}
