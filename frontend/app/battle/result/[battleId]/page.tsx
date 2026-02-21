"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FluentEmoji from "@/components/FluentEmoji";
import { mockAgent, mockBattleResult, STYLE_ICONS } from "@/lib/mock";

export default function BattleResult() {
	const router = useRouter();
	const [showContent, setShowContent] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [showLevelUp, setShowLevelUp] = useState(false);

	const battle = mockBattleResult;
	const playerResult = battle.rounds[0]?.results.find(
		(r) => r.uid === "player",
	);
	const opponentResult = battle.rounds[0]?.results.find(
		(r) => r.uid === "opponent",
	);
	const isWinner = battle.winnerUid === "player";

	useEffect(() => {
		const t1 = setTimeout(() => setShowContent(true), 300);
		const t2 = setTimeout(() => setShowDetails(true), 800);
		const t3 = setTimeout(() => setShowLevelUp(true), 1500);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="px-5 pt-5 pb-3">
				<h1 className="text-lg font-bold text-white text-center">バトル結果</h1>
			</div>

			<div className="flex-1 px-5 pb-8 overflow-y-auto">
				{/* Winner card */}
				<div
					className={`bg-amber-500 rounded-2xl p-6 mb-6 text-center transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
				>
					<p className="text-gray-900 font-extrabold text-2xl mb-1">WINNER</p>
					<p className="text-gray-900 font-bold text-lg mb-2">
						{isWinner ? playerResult?.agentName : opponentResult?.agentName}
					</p>
					<p className="text-gray-800 text-sm">「{battle.winnerBoke}」</p>
				</div>

				{/* Scores */}
				<div
					className={`grid grid-cols-2 gap-4 mb-6 transition-all duration-700 delay-200 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
				>
					{/* Player score */}
					<div
						className={`p-4 rounded-2xl text-center border ${isWinner ? "bg-amber-500/10 border-amber-500/40" : "bg-gray-800 border-gray-700"}`}
					>
						<div className="flex items-center justify-center gap-1 mb-2">
							<FluentEmoji name={STYLE_ICONS[mockAgent.style]} size={20} />
							<span className="text-white text-sm font-bold">
								{playerResult?.agentName}
							</span>
						</div>
						<p
							className={`text-4xl font-extrabold ${isWinner ? "text-amber-500" : "text-white"}`}
						>
							{battle.totalScores.player}
						</p>
						<p className="text-gray-400 text-xs mt-1">pts</p>
					</div>

					{/* Opponent score */}
					<div
						className={`p-4 rounded-2xl text-center border ${!isWinner ? "bg-amber-500/10 border-amber-500/40" : "bg-gray-800 border-gray-700"}`}
					>
						<div className="flex items-center justify-center gap-1 mb-2">
							<FluentEmoji name="collision" size={28} />
							<span className="text-white text-sm font-bold">
								{opponentResult?.agentName}
							</span>
						</div>
						<p
							className={`text-4xl font-extrabold ${!isWinner ? "text-amber-500" : "text-white"}`}
						>
							{battle.totalScores.opponent}
						</p>
						<p className="text-gray-400 text-xs mt-1">pts</p>
					</div>
				</div>

				{/* Winner image or fallback */}
				<div
					className={`mb-6 transition-all duration-700 delay-300 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
				>
					{battle.winnerImageUrl ? (
						<div className="rounded-2xl overflow-hidden">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={battle.winnerImageUrl}
								alt="Winner illustration"
								className="w-full h-48 object-cover"
							/>
						</div>
					) : (
						<div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 text-center">
							<div className="flex justify-center mb-3">
								<FluentEmoji name="party-popper" size={88} />
							</div>
							<p className="text-white font-bold">「{battle.winnerBoke}」</p>
							<p className="text-gray-400 text-sm mt-2">
								Best Boke of the Match
							</p>
						</div>
					)}
				</div>

				{/* Round details */}
				<div
					className={`mb-6 transition-all duration-700 delay-500 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
				>
					{battle.rounds.map((round) => (
						<div
							key={round.roundNumber}
							className="mb-4 bg-gray-800 rounded-2xl p-4"
						>
							<p className="text-amber-500 font-bold text-sm mb-3">
								ROUND {round.roundNumber}:「{round.odai}」
							</p>
							{round.results.map((result) => (
								<div
									key={result.uid}
									className="mb-3 last:mb-0 pl-3 border-l-2 border-gray-700"
								>
									<div className="flex items-center justify-between mb-1">
										<span className="text-white text-sm font-bold">
											{result.agentName}
										</span>
										<span className="text-amber-400 font-bold text-sm">
											{result.score}pts
										</span>
									</div>
									<p className="text-gray-300 text-sm mb-1">
										「{result.boke}」
									</p>
									<p className="text-gray-500 text-xs italic">
										{result.judgeComments}
									</p>
								</div>
							))}
						</div>
					))}
				</div>

				{/* Level up */}
				{showLevelUp && (
					<div className="animate-bounce-in mb-6">
						<div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-center">
							<p className="text-green-400 font-bold">レベルアップ!</p>
							<p className="text-green-300 text-sm">
								Lv.{mockAgent.level} → Lv.{mockAgent.level + 1}
							</p>
						</div>
					</div>
				)}

				{/* Back button */}
				<button
					type="button"
					onClick={() => router.push("/main")}
					className="w-full py-4 rounded-full bg-amber-500 text-gray-900 text-lg font-bold hover:bg-amber-400 active:scale-[0.98] transition-all"
				>
					メインに戻る
				</button>
			</div>
		</div>
	);
}
