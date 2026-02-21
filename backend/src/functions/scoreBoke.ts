import { onRequest } from 'firebase-functions/v2/https';
import type { ScoreBokeRequest, ScoreBokeResponse } from '@agiri/shared';
import { geminiApiKey, generateJsonResponse } from '../lib/gemini';
import { verifyAuth } from '../lib/auth';

export const scoreBoke = onRequest(
	{ cors: true, secrets: [geminiApiKey] },
	async (req, res) => {
		const uid = await verifyAuth(req, res);
		if (!uid) return;
		if (req.method !== 'POST') {
			res.status(405).json({ error: 'Method not allowed' });
			return;
		}

		try {
			const { odai, boke, agentProfile } = req.body as ScoreBokeRequest;

			const prompt = `あなたは大喜利の審査員です。以下のボケを採点してください。

お題: ${odai}
ボケ: ${boke}

このボケは「${agentProfile.style}」スタイルのエージェントが回答しました。
エージェントの特徴: ${agentProfile.brainData.traits.join('、') || 'まだ特徴なし'}
キーワード: ${agentProfile.brainData.keywords.join('、') || 'まだなし'}

以下の基準で1〜10点で採点してください：
- 面白さ（笑えるか）
- 意外性（予想外の回答か）
- スタイルとの一致度（エージェントのスタイルに合っているか）
- 完成度（お題との関連性、言葉選び）

また、エージェントの成長に役立つアドバイスを一言添えてください。
JSONで出力: {"score": 数値, "advice": "アドバイス文"}`;

			const result = await generateJsonResponse<ScoreBokeResponse>(prompt);
			result.score = Math.max(1, Math.min(10, Math.round(result.score)));
			res.json(result);
		} catch (error) {
			console.error('scoreBoke error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
);
