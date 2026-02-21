export type AgentStyle = 'シュール' | '爆発' | 'うまい系';

export interface BrainData {
	traits: string[];
	keywords: string[];
}

export interface AgentStats {
	wins: number;
	losses: number;
}

export interface AgentProfile {
	name: string;
	style: AgentStyle;
	level: number;
	brainData: BrainData;
	stats: AgentStats;
}

export interface Judge {
	name: string;
	personality: string;
	criteria: string;
}

export interface DummyAgent {
	name: string;
	style: AgentStyle;
	level: number;
	brainData: BrainData;
}

export type BattleStatus = 'processing' | 'round1_done' | 'round2_done' | 'done';

export interface RoundResult {
	uid: string;
	agentName: string;
	boke: string;
	score: number;
	intermediateThought: string;
	judgeComments: string;
}

export interface Round {
	roundNumber: number;
	odai: string;
	results: RoundResult[];
}

export interface Battle {
	status: BattleStatus;
	createdAt: Date;
	rounds: Round[];
	totalScores: Record<string, number>;
	winnerUid: string;
	winnerBoke: string;
	winnerImageUrl: string | null;
}

export interface ScoreBokeRequest {
	odai: string;
	boke: string;
	agentProfile: {
		style: AgentStyle;
		brainData: BrainData;
	};
}

export interface ScoreBokeResponse {
	score: number;
	advice: string;
}

export interface AnalyzeRequest {
	uid: string;
	session: Array<{
		odai: string;
		boke: string;
		score: number;
	}>;
}

export interface AnalyzeResponse {
	updated: boolean;
	newTraits: string[];
	levelUp: boolean;
}

export interface GenerateOdaiResponse {
	odaiList: string[];
}

export interface RunBattleRequest {
	uid: string;
}

export interface RunBattleResponse {
	battleId: string;
}
