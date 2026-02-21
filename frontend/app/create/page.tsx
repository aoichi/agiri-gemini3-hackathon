"use client";

import type { AgentStyle } from "@agiri/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STYLE_DESCRIPTIONS, STYLE_FACE, STYLE_ICONS } from "@/lib/mock";
import FluentEmoji from "@/components/FluentEmoji";

const STYLES: { value: AgentStyle; label: string }[] = [
	{ value: "シュール", label: "シュール" },
	{ value: "爆発", label: "爆発" },
	{ value: "うまい系", label: "うまい系" },
];

export default function CreateAgent() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [selected, setSelected] = useState<AgentStyle | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const canCreate = name.trim().length > 0 && selected !== null;

	const handleCreate = async () => {
		if (!canCreate) return;
		setIsCreating(true);
		// TODO: Firebase Auth uid取得 + createAgent(uid, { name, style })
		await new Promise((r) => setTimeout(r, 600));
		router.push("/main");
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				<button
					type="button"
					onClick={() => router.back()}
					className="opacity-70 hover:opacity-100 transition-opacity"
				>
					<FluentEmoji name="back-arrow" size={26} />
				</button>
				<h1 className="text-lg font-bold text-white">エージェント作成</h1>
				<div className="w-7" />
			</div>

			{/* Content */}
			<div className="flex-1 px-5 pb-8 overflow-y-auto">
				<p className="text-amber-500 text-sm font-bold mb-2">STEP 1/1</p>
				<h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
					エージェントを
					<br />
					作成してください
				</h2>
				<p className="text-gray-400 text-sm mb-6">
					名前とスタイルを決めると, あなたのAIエージェントが誕生します.
				</p>

				{/* Name input */}
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
				</div>

				{/* Style label */}
				<p className="text-white text-sm font-bold mb-3">お笑いのスタイル</p>

				{/* Style cards */}
				<div className="flex flex-col gap-4">
					{STYLES.map(({ value, label }) => (
						<button
							type="button"
							key={value}
							onClick={() => setSelected(value)}
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

			{/* Bottom button */}
			<div className="px-5 pb-8 pt-3">
				<button
					type="button"
					onClick={handleCreate}
					disabled={!canCreate || isCreating}
					className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-200 ${
						canCreate
							? "bg-amber-500 text-gray-900 hover:bg-amber-400 active:scale-[0.98]"
							: "bg-gray-700 text-gray-500 cursor-not-allowed"
					}`}
				>
					{isCreating ? "作成中..." : "作成する"}
				</button>
			</div>
		</div>
	);
}
