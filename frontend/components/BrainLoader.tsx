"use client";

import FluentEmoji from "./FluentEmoji";

interface BrainLoaderProps {
	message?: string;
	subMessage?: string;
	emoji?: string;
	size?: number;
	compact?: boolean;
}

export default function BrainLoader({
	message = "読み込み中",
	subMessage,
	emoji = "brain",
	size = 64,
	compact = false,
}: BrainLoaderProps) {
	if (compact) {
		return (
			<span className="inline-flex items-center gap-2">
				<span className="animate-brain-think inline-block">
					<FluentEmoji name={emoji} size={20} />
				</span>
				<span>{message}</span>
				<span className="flex gap-0.5 items-center">
					<span className="w-1 h-1 bg-current rounded-full animate-dot-pulse" />
					<span className="w-1 h-1 bg-current rounded-full animate-dot-pulse delay-100" />
					<span className="w-1 h-1 bg-current rounded-full animate-dot-pulse delay-200" />
				</span>
			</span>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center gap-3">
			<div className="relative flex items-center justify-center" style={{ width: size + 40, height: size + 40 }}>
				{/* Orbiting sparkles */}
				<div className="absolute inset-0 animate-orbit">
					<span className="absolute top-0 left-1/2 -translate-x-1/2">
						<FluentEmoji name="sparkles" size={20} />
					</span>
				</div>
				<div className="absolute inset-0 animate-orbit" style={{ animationDelay: "-1.3s" }}>
					<span className="absolute top-0 left-1/2 -translate-x-1/2">
						<FluentEmoji name="high-voltage" size={16} />
					</span>
				</div>
				<div className="absolute inset-0 animate-orbit" style={{ animationDelay: "-2.6s" }}>
					<span className="absolute top-0 left-1/2 -translate-x-1/2">
						<FluentEmoji name="sparkles" size={14} />
					</span>
				</div>

				{/* Brain with think animation */}
				<div className="animate-brain-think">
					<FluentEmoji name={emoji} size={size} />
				</div>
			</div>

			<div className="text-center">
				<p className="text-amber-500 font-bold text-lg flex items-center gap-1 justify-center">
					{message}
					<span className="flex gap-0.5 ml-0.5 items-center">
						<span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-dot-pulse" />
						<span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-dot-pulse delay-100" />
						<span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-dot-pulse delay-200" />
					</span>
				</p>
				{subMessage && (
					<p className="text-gray-400 text-sm mt-1">{subMessage}</p>
				)}
			</div>
		</div>
	);
}
