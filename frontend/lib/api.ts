import { auth } from './firebase';
import type {
	ScoreBokeRequest,
	ScoreBokeResponse,
	AnalyzeRequest,
	AnalyzeResponse,
	GenerateOdaiResponse,
	RunBattleResponse,
} from '@agiri/shared';

const BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL;

async function callFunction<T>(name: string, body: object): Promise<T> {
	const token = await auth.currentUser?.getIdToken();
	if (!token) throw new Error('Not authenticated');

	const res = await fetch(`${BASE_URL}/${name}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const errorBody = await res.json().catch(() => null);
		throw new Error(errorBody?.error ?? `${name} failed: ${res.status}`);
	}

	return res.json();
}

export const generateOdai = () => callFunction<GenerateOdaiResponse>('generateOdai', {});

export const scoreBoke = (body: ScoreBokeRequest) =>
	callFunction<ScoreBokeResponse>('scoreBoke', body);

export const analyzeAndUpdateBrain = (body: AnalyzeRequest) =>
	callFunction<AnalyzeResponse>('analyzeAndUpdateBrain', body);

export const runBattle = () =>
	callFunction<RunBattleResponse>('runBattle', {});
