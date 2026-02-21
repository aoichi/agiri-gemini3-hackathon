import { onRequest } from 'firebase-functions/v2/https';
import type { AnalyzeResponse } from '@agiri/shared';

export const analyzeAndUpdateBrain = onRequest(async (req, res) => {
	// TODO: セッションデータを分析し, brainData を更新
	const response: AnalyzeResponse = {
		updated: true,
		newTraits: [],
		levelUp: true,
	};
	res.json(response);
});
