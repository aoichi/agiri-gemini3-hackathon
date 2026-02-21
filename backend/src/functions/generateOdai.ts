import { onRequest } from 'firebase-functions/v2/https';
import type { GenerateOdaiResponse } from '@agiri/shared';

export const generateOdai = onRequest(async (req, res) => {
	// TODO: Gemini API でお題を生成
	const response: GenerateOdaiResponse = {
		odaiList: ['お題1', 'お題2'],
	};
	res.json(response);
});
