import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import type { AnalyzeRequest, AnalyzeResponse, AgentProfile } from '@agiri/shared';
import { geminiApiKey, generateJsonResponse } from '../lib/gemini';
import { verifyAuth } from '../lib/auth';

export const analyzeAndUpdateBrain = onRequest(
	{ cors: true, secrets: [geminiApiKey] },
	async (req, res) => {
		const uid = await verifyAuth(req, res);
		if (!uid) return;
		if (req.method !== 'POST') {
			res.status(405).json({ error: 'Method not allowed' });
			return;
		}

		try {
			const body = req.body as AnalyzeRequest;
			if (body.uid !== uid) {
				res.status(403).json({ error: 'Forbidden' });
				return;
			}

			const db = getFirestore();
			const agentDoc = await db.collection('agents').doc(uid).get();
			if (!agentDoc.exists) {
				res.status(404).json({ error: 'Agent not found' });
				return;
			}
			const agent = agentDoc.data() as AgentProfile;

			const prompt = `あなたは大喜利AIエージェントの分析官です。以下の修行セッションの結果を分析し、エージェントの新しい特徴を提案してください。

エージェントのスタイル: ${agent.style}
現在のレベル: ${agent.level}
現在の特徴: ${agent.brainData.traits.join('、') || 'なし'}
現在のキーワード: ${agent.brainData.keywords.join('、') || 'なし'}

修行結果:
${body.session.map((s, i) => `${i + 1}. お題「${s.odai}」→ ボケ「${s.boke}」→ スコア: ${s.score}/10`).join('\n')}

以下を提案してください：
1. 新しい特徴（traits）: エージェントの回答傾向から見える新しい個性や特徴を2〜3個。既存の特徴と重複しないこと。
2. 新しいキーワード: エージェントが好んで使いそうなキーワードや言い回しを3〜5個。

JSONで出力: {"newTraits": ["特徴1", "特徴2"], "newKeywords": ["キーワード1", "キーワード2", "キーワード3"]}`;

			const result = await generateJsonResponse<{
				newTraits: string[];
				newKeywords: string[];
			}>(prompt);

			const updatedTraits = [...agent.brainData.traits, ...result.newTraits].slice(-10);
			const updatedKeywords = [
				...agent.brainData.keywords,
				...(result.newKeywords || []),
			].slice(-20);

			await db.collection('agents').doc(uid).update({
				'brainData.traits': updatedTraits,
				'brainData.keywords': updatedKeywords,
				level: agent.level + 1,
			});

			const response: AnalyzeResponse = {
				updated: true,
				newTraits: result.newTraits,
				levelUp: true,
			};
			res.json(response);
		} catch (error) {
			console.error('analyzeAndUpdateBrain error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
);
