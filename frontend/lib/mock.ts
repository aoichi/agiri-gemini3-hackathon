import type {
	AgentProfile,
	AgentStyle,
	Battle,
	GenerateOdaiResponse,
	ScoreBokeResponse,
	AnalyzeResponse,
	RunBattleResponse,
} from '@agiri/shared';

export const STYLE_NAMES: Record<AgentStyle, string> = {
	'シュール': 'シュールマスター',
	'爆発': '爆裂ボンバー',
	'うまい系': '言葉の魔術師',
};

export const STYLE_DESCRIPTIONS: Record<AgentStyle, string> = {
	'シュール': '予想外の角度から攻める不条理系. 意味不明なのに笑える, そんなボケを生み出します.',
	'爆発': '勢いとパワーで押し切る. テンション高めの破壊力抜群なボケが得意です.',
	'うまい系': '言葉の巧みさで魅せる技巧派. ダジャレや掛詞など, 知的なボケを繰り出します.',
};

export const STYLE_ICONS: Record<AgentStyle, string> = {
	'シュール': '🌀',
	'爆発': '💥',
	'うまい系': '✨',
};

export const BRAIN_LABELS: Record<number, string> = {
	1: '初期状態',
	2: '学習中',
	3: '成長中',
	4: '覚醒中',
	5: '達人級',
};

export function getBrainLabel(level: number): string {
	if (level >= 5) return BRAIN_LABELS[5];
	return BRAIN_LABELS[level] || BRAIN_LABELS[1];
}

export const mockAgent: AgentProfile & { name: string } = {
	name: 'シュールマスター',
	style: 'シュール',
	level: 3,
	brainData: {
		traits: ['不条理', '意外性'],
		keywords: ['逆転', '日常破壊'],
	},
	stats: {
		wins: 3,
		losses: 1,
	},
};

export const mockOpponent: AgentProfile & { name: string } = {
	name: '爆裂ボンバー',
	style: '爆発',
	level: 5,
	brainData: {
		traits: ['パワー', 'テンション'],
		keywords: ['爆発', '破壊'],
	},
	stats: {
		wins: 4,
		losses: 2,
	},
};

const MOCK_ODAI_LIST = [
	'こんな回転寿司はいやだ',
	'未来の運動会にありそうな競技',
];

export async function mockGenerateOdai(): Promise<GenerateOdaiResponse> {
	await delay(800);
	return { odaiList: MOCK_ODAI_LIST };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function mockScoreBoke(_boke: string): Promise<ScoreBokeResponse> {
	await delay(1200);
	const score = 60 + Math.floor(Math.random() * 30);
	return {
		score,
		advice: score >= 80
			? 'すばらしい! 独創性とキレが光ります. この調子で攻めましょう.'
			: 'シュールさはあるが, もう一捻り欲しい. 「逆回転」だけでなく, その先の展開を加えるとより笑いが深まります.',
	};
}

export async function mockAnalyzeAndUpdateBrain(): Promise<AnalyzeResponse> {
	await delay(1000);
	return {
		updated: true,
		newTraits: ['シュール度UP', '意外性強化'],
		levelUp: true,
	};
}

export async function mockRunBattle(): Promise<RunBattleResponse> {
	await delay(500);
	return { battleId: 'mock-battle-001' };
}

export const mockBattleResult: Battle = {
	status: 'done',
	createdAt: new Date(),
	rounds: [
		{
			roundNumber: 1,
			odai: 'こんな回転寿司はいやだ',
			results: [
				{
					uid: 'player',
					agentName: 'シュールマスター',
					boke: 'お寿司がベルトコンベアに乗って出勤している',
					score: 85,
					intermediateThought: 'このお題は食べ物系だから, 意外な組み合わせで攻めよう...',
					judgeComments: '寿司の擬人化と出勤という日常の組み合わせが秀逸!',
				},
				{
					uid: 'opponent',
					agentName: '爆裂ボンバー',
					boke: 'レーンの速度が音速',
					score: 72,
					intermediateThought: 'スピード感で攻めてみよう...',
					judgeComments: 'パワー系のボケだが, もう少し具体性が欲しい.',
				},
			],
		},
		{
			roundNumber: 2,
			odai: '未来の運動会にありそうな競技',
			results: [
				{
					uid: 'player',
					agentName: 'シュールマスター',
					boke: '玉入れの玉が全部目玉焼き',
					score: 83,
					intermediateThought: '運動会の定番競技を食べ物で不条理にしよう...',
					judgeComments: 'ビジュアルが浮かぶシュールさ. 玉と目玉焼きの掛け方もうまい.',
				},
				{
					uid: 'opponent',
					agentName: '爆裂ボンバー',
					boke: '100m走のゴールが爆発する',
					score: 70,
					intermediateThought: '爆発要素を入れたい...',
					judgeComments: 'スタイルに忠実だが, 予想の範囲内.',
				},
			],
		},
	],
	totalScores: { player: 168, opponent: 142 },
	winnerUid: 'player',
	winnerBoke: 'お寿司がベルトコンベアに乗って出勤している',
	winnerImageUrl: null,
};

export function mockBattleStatusSequence(
	onUpdate: (battle: Partial<Battle>) => void,
) {
	const timers: NodeJS.Timeout[] = [];

	timers.push(
		setTimeout(() => {
			onUpdate({
				status: 'processing',
				rounds: [],
			});
		}, 500),
	);

	timers.push(
		setTimeout(() => {
			onUpdate({
				status: 'round1_done',
				rounds: [mockBattleResult.rounds[0]],
			});
		}, 3000),
	);

	timers.push(
		setTimeout(() => {
			onUpdate({
				status: 'round2_done',
				rounds: mockBattleResult.rounds,
			});
		}, 6000),
	);

	timers.push(
		setTimeout(() => {
			onUpdate(mockBattleResult);
		}, 8000),
	);

	return () => timers.forEach(clearTimeout);
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
