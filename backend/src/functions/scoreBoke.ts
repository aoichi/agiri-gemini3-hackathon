import { onRequest } from 'firebase-functions/v2/https';
import type { ScoreBokeResponse } from '@agiri/shared';

export const scoreBoke = onRequest(async (req, res) => {
	// TODO: Gemini API でボケを採点
	const response: ScoreBokeResponse = {
		score: 0,
		advice: '',
	};
	res.json(response);
});
