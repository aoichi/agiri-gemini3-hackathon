"use client";

import type { AgentStyle } from "@agiri/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { STYLE_DESCRIPTIONS, STYLE_FACE, STYLE_ICONS, STYLE_NAMES } from "@/lib/mock";
import FluentEmoji from "@/components/FluentEmoji";
import { useAuth } from "@/lib/auth";
import { createAgent, getAgent } from "@/lib/firestore";

const STYLES: { value: AgentStyle; label: string }[] = [
	{ value: "シュール", label: "シュール" },
	{ value: "爆発", label: "爆発" },
	{ value: "うまい系", label: "うまい系" },
];

export default function CreateAgent() {
	const router = useRouter();
	const { uid, loading: authLoading } = useAuth();
	const [step, setStep] = useState<1 | 2>(1);
	const [name, setName] = useState("");
	const [selected, setSelected] = useState<AgentStyle | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [hasExistingAgent, setHasExistingAgent] = useState(false);

	useEffect(() => {
		if (authLoading || !uid) return;
		getAgent(uid).then((a) => setHasExistingAgent(!!a)).catch(() => {});
	}, [uid, authLoading]);

	const handleSelectStyle = (style: AgentStyle) => {
		setSelected(style);
		setName(STYLE_NAMES[style]);
	};

	const handleNext = () => {
		if (!selected) return;
		setStep(2);
	};

	const handleBack = () => {
		if (step === 2) {
			setStep(1);
			return;
		}
		if (hasExistingAgent) {
			router.back();
		}
	};

	const handleCreate = async () => {
		if (!name.trim() || !selected || !uid) return;
		if (hasExistingAgent && !window.confirm("既存のエージェントデータが上書きされます. よろしいですか?")) {
			return;
		}
		setIsCreating(true);
		try {
			await createAgent(uid, {
				name: name.trim(),
				style: selected,
				level: 1,
				brainData: { traits: [], keywords: [] },
				stats: { wins: 0, losses: 0 },
			});
			router.push("/main");
		} catch (e) {
			console.error("Failed to create agent:", e);
			setIsCreating(false);
		}
	};

	const showBackButton = step === 2 || hasExistingAgent;

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				{showBackButton ? (
					<button
						type="button"
						onClick={handleBack}
						className="opacity-70 hover:opacity-100 transition-opacity"
					>
						<FluentEmoji name="back-arrow" size={26} />
					</button>
				) : (
					<div className="w-7" />
				)}
				<h1 className="text-lg font-bold text-white">エージェント作成</h1>
				<div className="w-7" />
			</div>

			{/* Step 1: Style selection */}
			{step === 1 && (
				<>
					<div className="flex-1 px-5 pb-8 overflow-y-auto">
						<p className="text-amber-500 text-sm font-bold mb-2">STEP 1/2</p>
						<h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
							お笑いのスタイルを
							<br />
							選んでください
						</h2>
						<p className="text-gray-400 text-sm mb-6">
							スタイルによってAIの笑いの方向性が変わります.
						</p>

						<div className="flex flex-col gap-4">
							{STYLES.map(({ value, label }) => (
								<button
									type="button"
									key={value}
									onClick={() => handleSelectStyle(value)}
									className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
										selected === value
											? "border-amber-500 bg-gray-800/80"
											: "border-gray-700 bg-gray-800/40 hover:border-gray-600"
									}`}
								>
									<div className="flex items-center gap-3 mb-2">
										<FluentEmoji name={STYLE_FACE[value]} size={40} />
										<div className="flex items-center gap-2">
											<FluentEmoji name={STYLE_ICONS[value]} size={20} />
											<h3 className="text-lg font-bold text-white">{label}</h3>
										</div>
									</div>
									<p className="text-gray-400 text-sm leading-relaxed">
										{STYLE_DESCRIPTIONS[value]}
									</p>
								</button>
							))}
						</div>
					</div>

					<div className="px-5 pb-8 pt-3">
						<button
							type="button"
							onClick={handleNext}
							disabled={!selected}
							className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-200 ${
								selected
									? "bg-amber-500 text-gray-900 hover:bg-amber-400 active:scale-[0.98]"
									: "bg-gray-700 text-gray-500 cursor-not-allowed"
							}`}
						>
							次へ
						</button>
					</div>
				</>
			)}

			{/* Step 2: Name input */}
			{step === 2 && selected && (
				<>
					<div className="flex-1 px-5 pb-8 overflow-y-auto">
						<p className="text-amber-500 text-sm font-bold mb-2">STEP 2/2</p>
						<h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
							エージェントの
							<br />
							名前を決めよう
						</h2>
						<p className="text-gray-400 text-sm mb-6">
							あなたのAIエージェントに名前をつけてください.
						</p>

						{/* Selected style preview */}
						<div className="flex items-center gap-3 p-4 bg-gray-800 rounded-2xl mb-6">
							<FluentEmoji name={STYLE_FACE[selected]} size={48} />
							<div>
								<div className="flex items-center gap-1.5">
									<FluentEmoji name={STYLE_ICONS[selected]} size={16} />
									<span className="text-amber-400 text-sm font-bold">{selected}</span>
								</div>
								<p className="text-gray-400 text-xs mt-1">選択中のスタイル</p>
							</div>
						</div>

						<div className="mb-6">
							<label
								className="block text-white text-sm font-bold mb-2"
								htmlFor="agent-name"
							>
								エージェント名
							</label>
							<input
								id="agent-name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="例: シュールマスター"
								maxLength={20}
								
								className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
							/>
							<p className="text-gray-500 text-xs mt-2 text-right">{name.length}/20</p>
						</div>
					</div>

					<div className="px-5 pb-8 pt-3">
						<button
							type="button"
							onClick={handleCreate}
							disabled={!name.trim() || isCreating}
							className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-200 ${
								name.trim()
									? "bg-amber-500 text-gray-900 hover:bg-amber-400 active:scale-[0.98]"
									: "bg-gray-700 text-gray-500 cursor-not-allowed"
							}`}
						>
							{isCreating ? "作成中..." : "作成する"}
						</button>
					</div>
				</>
			)}
		</div>
	);
}
