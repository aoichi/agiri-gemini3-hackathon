'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
	mockGenerateOdai,
	mockScoreBoke,
	mockAnalyzeAndUpdateBrain,
	mockAgent,
} from '@/lib/mock';

type Phase = 'loading' | 'input' | 'scoring' | 'scored' | 'analyzing' | 'done';

interface QuestionResult {
	odai: string;
	boke: string;
	score: number;
	advice: string;
}

export default function Training() {
	const router = useRouter();
	const [phase, setPhase] = useState<Phase>('loading');
	const [odaiList, setOdaiList] = useState<string[]>([]);
	const [currentQ, setCurrentQ] = useState(0);
	const [boke, setBoke] = useState('');
	const [, setResults] = useState<QuestionResult[]>([]);
	const [currentScore, setCurrentScore] = useState<{
		score: number;
		advice: string;
	} | null>(null);
	const [brainUpdate, setBrainUpdate] = useState<{
		newTraits: string[];
		levelUp: boolean;
	} | null>(null);

	const totalQuestions = 2;

	const startTraining = async () => {
		setPhase('loading');
		const res = await mockGenerateOdai();
		setOdaiList(res.odaiList);
		setPhase('input');
	};

	const handleSubmit = async () => {
		if (!boke.trim()) return;
		setPhase('scoring');
		const res = await mockScoreBoke(boke);
		setCurrentScore(res);
		setResults((prev) => [
			...prev,
			{ odai: odaiList[currentQ], boke, score: res.score, advice: res.advice },
		]);
		setPhase('scored');
	};

	const handleNext = async () => {
		if (currentQ + 1 < totalQuestions) {
			setCurrentQ((prev) => prev + 1);
			setBoke('');
			setCurrentScore(null);
			setPhase('input');
		} else {
			setPhase('analyzing');
			const res = await mockAnalyzeAndUpdateBrain();
			setBrainUpdate(res);
			setPhase('done');
		}
	};

	const initialized = useRef(false);
	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			startTraining();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				<h1 className="text-lg font-bold text-white">修行</h1>
				<span className="text-gray-400 text-sm">
					{currentQ + 1} / {totalQuestions}
				</span>
			</div>

			{/* Loading - centered */}
			{phase === 'loading' && (
				<div className="flex-1 flex flex-col items-center justify-center px-5">
					<div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
					<p className="text-gray-400 mt-4 text-sm">お題を準備中...</p>
				</div>
			)}

			{/* Input / Scoring / Scored */}
			{(phase === 'input' || phase === 'scoring' || phase === 'scored') && (
				<>
					{/* Content area */}
					<div className="flex-1 px-5 overflow-y-auto">
						{/* Odai card */}
						<div className="bg-gray-800 rounded-2xl p-5 mb-6">
							<span className="inline-block px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded mb-3">
								🎯 お題
							</span>
							<h2 className="text-xl font-extrabold text-white leading-snug">
								「{odaiList[currentQ]}」
							</h2>
						</div>

						{/* Input */}
						<div className="mb-4">
							<p className="text-gray-300 text-sm font-bold mb-2">
								あなたのボケ
							</p>
							<textarea
								value={boke}
								onChange={(e) => setBoke(e.target.value)}
								placeholder="ボケを入力してください..."
								disabled={phase !== 'input'}
								className="w-full h-28 p-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-600 resize-none focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-60"
							/>
						</div>

						{/* Score result */}
						{phase === 'scored' && currentScore && (
							<div className="animate-slide-up border-2 border-amber-500/50 bg-gray-800 rounded-2xl p-5 mb-4">
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-white font-bold">採点結果</h3>
									<span className="text-2xl font-extrabold text-amber-500">
										{currentScore.score}{' '}
										<span className="text-base text-gray-400">/ 100</span>
									</span>
								</div>
								<p className="text-gray-300 text-sm leading-relaxed">
									{currentScore.advice}
								</p>
							</div>
						)}
					</div>

					{/* Bottom button - pinned */}
					<div className="px-5 pb-6 pt-3">
						{phase === 'scored' ? (
							<button
								type="button"
								onClick={handleNext}
								className="w-full py-4 rounded-full bg-amber-500 text-gray-900 text-lg font-bold hover:bg-amber-400 active:scale-[0.98] transition-all"
							>
								{currentQ + 1 < totalQuestions
									? '次のお題へ'
									: '修行を完了する'}
							</button>
						) : (
							<button
								type="button"
								onClick={handleSubmit}
								disabled={phase !== 'input' || !boke.trim()}
								className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-200 ${
									phase === 'input' && boke.trim()
										? 'bg-amber-500 text-gray-900 hover:bg-amber-400 active:scale-[0.98]'
										: 'bg-gray-700 text-gray-500 cursor-not-allowed'
								}`}
							>
								{phase === 'scoring' ? (
									<span className="flex items-center justify-center gap-2">
										<span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
										採点中...
									</span>
								) : (
									'回答する'
								)}
							</button>
						)}
					</div>
				</>
			)}

			{/* Analyzing - centered */}
			{phase === 'analyzing' && (
				<div className="flex-1 flex flex-col items-center justify-center px-5">
					<div className="text-5xl mb-4 animate-bounce">🧠</div>
					<p className="text-amber-500 font-bold text-lg">
						脳みそを分析中...
					</p>
					<p className="text-gray-400 text-sm mt-2">
						あなたの回答パターンを学習しています
					</p>
				</div>
			)}

			{/* Done - centered */}
			{phase === 'done' && brainUpdate && (
				<>
					<div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
						<div className="text-5xl mb-4">🧠</div>
						<h2 className="text-xl font-extrabold text-white mb-2">
							修行完了!
						</h2>

						{brainUpdate.levelUp && (
							<div className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full mb-4">
								<p className="text-green-400 font-bold text-sm">
									レベルアップ! Lv.{mockAgent.level} → Lv.
									{mockAgent.level + 1}
								</p>
							</div>
						)}

						<div className="flex flex-wrap gap-2 justify-center">
							{brainUpdate.newTraits.map((trait) => (
								<span
									key={trait}
									className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 text-sm"
								>
									{trait}
								</span>
							))}
						</div>
					</div>

					<div className="px-5 pb-6 pt-3">
						<button
							type="button"
							onClick={() => router.push('/main')}
							className="w-full py-4 rounded-full bg-amber-500 text-gray-900 text-lg font-bold hover:bg-amber-400 active:scale-[0.98] transition-all"
						>
							メインに戻る
						</button>
					</div>
				</>
			)}
		</div>
	);
}
