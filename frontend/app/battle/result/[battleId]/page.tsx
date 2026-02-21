"use client";

import type { AgentProfile, Battle } from "@agiri/shared";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrainLoader from "@/components/BrainLoader";
import FluentEmoji from "@/components/FluentEmoji";
import { STYLE_ICONS } from "@/lib/mock";
import { useAuth } from "@/lib/auth";
import { getAgent, subscribeToBattle } from "@/lib/firestore";
import { generateBattleImage } from "@/lib/api";

export default function BattleResult() {
	const router = useRouter();
	const params = useParams();
	const battleId = params.battleId as string;
	const { uid, loading: authLoading } = useAuth();
	const [agent, setAgent] = useState<AgentProfile | null>(null);
	const [battle, setBattle] = useState<Battle | null>(null);
	const [showContent, setShowContent] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	const [generatedImage, setGeneratedImage] = useState<string | null>(null);
	const imageRequested = useRef(false);

	useEffect(() => {
		if (authLoading || !uid) return;
		getAgent(uid).then(setAgent).catch(console.error);
	}, [uid, authLoading]);

	useEffect(() => {
		if (!battleId) return;
		const unsubscribe = subscribeToBattle(battleId, (b) => {
			setBattle(b);
		});
		return unsubscribe;
	}, [battleId]);

	useEffect(() => {
		if (!battle) return;
		const t1 = setTimeout(() => setShowContent(true), 300);
		const t2 = setTimeout(() => setShowDetails(true), 800);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [battle]);

	useEffect(() => {
		if (
			!battle ||
			!battleId ||
			battle.winnerImageUrl ||
			!battle.winnerBoke ||
			imageRequested.current
		)
			return;
		imageRequested.current = true;
		setImageLoading(true);
		generateBattleImage({ battleId })
			.then((res) => {
				if (res.imageUrl) setGeneratedImage(res.imageUrl);
			})
			.catch(console.error)
			.finally(() => setImageLoading(false));
	}, [battle, battleId]);

	if (!battle || !uid || !agent) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<BrainLoader message="結果を取得中" />
			</div>
		);
	}

	const playerResult = battle.rounds[0]?.results.find(
		(r) => r.uid === uid,
	);
	const opponentResult = battle.rounds[0]?.results.find(
		(r) => r.uid !== uid,
	);
	const isWinner = battle.winnerUid === uid;
	const playerScore = battle.totalScores[uid] ?? 0;
	const opponentUid = Object.keys(battle.totalScores).find((k) => k !== uid);
	const opponentScore = opponentUid ? battle.totalScores[opponentUid] ?? 0 : 0;

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
							<FluentEmoji name={STYLE_ICONS[agent.style]} size={20} />
							<span className="text-white text-sm font-bold">
								{playerResult?.agentName}
							</span>
						</div>
						<p
							className={`text-4xl font-extrabold ${isWinner ? "text-amber-500" : "text-white"}`}
						>
							{playerScore}
						</p>
						<p className="text-gray-400 text-xs mt-1">pts</p>
					</div>

					{/* Opponent score */}
					<div
						className={`p-4 rounded-2xl text-center border ${!isWinner ? "bg-amber-500/10 border-amber-500/40" : "bg-gray-800 border-gray-700"}`}
					>
						<div className="flex items-center justify-center gap-1 mb-2">
							<FluentEmoji name="robot" size={20} />
							<span className="text-white text-sm font-bold">
								{opponentResult?.agentName}
							</span>
						</div>
						<p
							className={`text-4xl font-extrabold ${!isWinner ? "text-amber-500" : "text-white"}`}
						>
							{opponentScore}
						</p>
						<p className="text-gray-400 text-xs mt-1">pts</p>
					</div>
				</div>

				{/* Best Boke of the Match */}
				<div
					className={`mb-6 transition-all duration-700 delay-300 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
				>
					<div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 text-center">
						<p className="text-gray-400 text-sm mb-2">
							Best Boke of the Match
						</p>
						<p className="text-white font-bold text-lg mb-4">
							「{battle.winnerBoke}」
						</p>

						{battle.winnerImageUrl || generatedImage ? (
							<div className="rounded-xl overflow-hidden animate-fade-in">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={battle.winnerImageUrl ?? generatedImage ?? ""}
									alt="Winner illustration"
									className="w-full h-48 object-cover"
								/>
							</div>
						) : imageLoading ? (
							<div className="flex flex-col items-center gap-2 py-4 animate-fade-in">
								<span className="animate-bounce">
									<FluentEmoji name="paintbrush" size={48} />
								</span>
								<p className="text-gray-400 text-xs">
									イラストを描いています...
								</p>
							</div>
						) : (
							<div className="flex justify-center">
								<FluentEmoji name="party-popper" size={64} />
							</div>
						)}
					</div>
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
