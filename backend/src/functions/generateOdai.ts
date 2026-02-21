import { onRequest } from 'firebase-functions/v2/https';
import type { GenerateOdaiResponse } from '@agiri/shared';
import { geminiApiKey, generateJsonResponse } from '../lib/gemini';
import { verifyAuth } from '../lib/auth';

export const generateOdai = onRequest(
	{ cors: true, secrets: [geminiApiKey] },
	async (req, res) => {
		const uid = await verifyAuth(req, res);
		if (!uid) return;
		if (req.method !== 'POST') {
			res.status(405).json({ error: 'Method not allowed' });
			return;
		}

		try {
			const prompt = `あなたは大喜利の出題者です。バラエティ豊かな大喜利のお題を2つ生成してください。

お題は以下のフォーマットからランダムに選んでください：
- 「こんな〇〇は嫌だ」
- 「〇〇で一言」
- 「もしも〇〇だったら」
- 「〇〇あるある」
- 自由形式のお題

各お題は30文字以内にしてください。
JSONで出力してください: {"odaiList": ["お題1", "お題2"]}`;

			const result = await generateJsonResponse<GenerateOdaiResponse>(prompt);
			res.json(result);
		} catch (error) {
			console.error('generateOdai error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
);
