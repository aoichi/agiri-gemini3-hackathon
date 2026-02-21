import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import type { GenerateBattleImageResponse } from '@agiri/shared';
import { geminiApiKey, generateImage } from '../lib/gemini';
import { verifyAuth } from '../lib/auth';

export const generateBattleImage = onRequest(
	{ timeoutSeconds: 60, cors: true, secrets: [geminiApiKey] },
	async (req, res) => {
		const uid = await verifyAuth(req, res);
		if (!uid) return;
		if (req.method !== 'POST') {
			res.status(405).json({ error: 'Method not allowed' });
			return;
		}

		const { battleId } = req.body as { battleId?: string };
		if (!battleId) {
			res.status(400).json({ error: 'battleId is required' });
			return;
		}

		try {
			const db = getFirestore();
			const battleDoc = await db.collection('battles').doc(battleId).get();
			if (!battleDoc.exists) {
				res.status(404).json({ error: 'Battle not found' });
				return;
			}

			const battle = battleDoc.data() as Record<string, unknown>;
			if (battle.winnerImageUrl) {
				const response: GenerateBattleImageResponse = {
					imageUrl: battle.winnerImageUrl as string,
				};
				res.json(response);
				return;
			}

			const winnerBoke = battle.winnerBoke as string;
			if (!winnerBoke) {
				const response: GenerateBattleImageResponse = { imageUrl: null };
				res.json(response);
				return;
			}

			const imageData = await generateImage(
				`大喜利の優勝作品をイメージした楽しいイラスト。テーマ: ${winnerBoke}`,
			);

			const response: GenerateBattleImageResponse = {
				imageUrl: imageData,
			};
			res.json(response);
		} catch (error) {
			console.error('generateBattleImage error:', error);
			res.status(500).json({ error: 'Image generation failed' });
		}
	},
);
