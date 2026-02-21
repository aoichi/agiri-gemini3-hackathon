"use client";

import type { AgentProfile } from "@agiri/shared";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FluentEmoji from "@/components/FluentEmoji";
import { STYLE_FACE, STYLE_ICONS } from "@/lib/mock";
import { useAuth } from "@/lib/auth";
import { getAgent } from "@/lib/firestore";

export default function Main() {
	const router = useRouter();
	const { uid, loading: authLoading } = useAuth();
	const [agent, setAgent] = useState<AgentProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (authLoading || !uid) return;
		getAgent(uid).then((a) => {
			if (!a) {
				router.replace("/create");
				return;
			}
			setAgent(a);
			setLoading(false);
		}).catch(console.error);
	}, [uid, authLoading, router]);

	if (loading || !agent) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between px-5 pt-5 pb-3">
				<Image src="/aigiri-logo.png" alt="A喜利" width={120} height={40} className="h-10 w-auto" />
				<button
					type="button"
					onClick={() => router.push("/create")}
					className="opacity-70 hover:opacity-100 transition-opacity"
				>
					<FluentEmoji name="wrench" size={26} />
				</button>
			</div>

			{/* Profile card */}
			<div className="mx-5 mt-2 p-6 bg-gray-800 rounded-2xl">
				{/* Avatar */}
				<div className="flex justify-center mb-4">
					<FluentEmoji name={STYLE_FACE[agent.style]} size={80} />
				</div>

				{/* Name */}
				<div className="flex items-center justify-center gap-2 mb-3">
					<h2 className="text-xl font-extrabold text-white">{agent.name}</h2>
				</div>

				{/* Style tag + Lv */}
				<div className="flex items-center justify-center gap-2">
					<span className="inline-flex items-center gap-1.5 px-3 py-1 border border-amber-500/50 rounded-full text-sm text-amber-400">
						<FluentEmoji name={STYLE_ICONS[agent.style]} size={20} /> {agent.style}
					</span>
					<span className="px-3 py-1 bg-amber-500 text-gray-900 text-sm font-extrabold rounded-full">
						Lv.{agent.level}
					</span>
				</div>
			</div>

			{/* Stats */}
			<div className="mx-5 mt-4 grid grid-cols-2 gap-3">
				<div className="bg-gray-800 rounded-2xl py-5 flex flex-col items-center">
					<p className="text-4xl font-extrabold text-amber-500 leading-none">
						{agent.stats.wins}
					</p>
					<p className="text-gray-400 text-xs mt-2 font-bold tracking-widest uppercase">WIN</p>
				</div>
				<div className="bg-gray-800 rounded-2xl py-5 flex flex-col items-center">
					<p className="text-4xl font-extrabold text-gray-300 leading-none">
						{agent.stats.losses}
					</p>
					<p className="text-gray-400 text-xs mt-2 font-bold tracking-widest uppercase">LOSE</p>
				</div>
			</div>

			{/* Action button - Training only */}
			<div className="flex-1 flex flex-col justify-end gap-3 px-5 pb-6">
				<button
					type="button"
					onClick={() => router.push("/training")}
					className="flex items-center gap-4 w-full p-4 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors group"
				>
					<div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
						<FluentEmoji name="high-voltage" size={32} />
					</div>
					<div className="flex-1 text-left">
						<p className="text-white font-bold">修行する</p>
						<p className="text-gray-400 text-sm">お題に答えて脳みそを鍛えよう</p>
					</div>
					<svg
						aria-hidden="true"
						className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			{/* Bottom nav */}
			<div className="flex items-center justify-around py-3 border-t border-gray-800">
				<button
					type="button"
					onClick={() => router.push("/main")}
					className="flex flex-col items-center gap-1"
				>
					<FluentEmoji name="house" size={28} />
					<span className="text-[10px] text-amber-500">ホーム</span>
				</button>
				<button
					type="button"
					onClick={() => router.push("/battle")}
					className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
				>
					<FluentEmoji name="crossed-swords" size={28} />
					<span className="text-[10px] text-gray-400">バトル</span>
				</button>
			</div>
		</div>
	);
}
