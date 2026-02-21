import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type {
	RunBattleResponse,
	AgentProfile,
	Round,
	RoundResult,
	Judge,
	DummyAgent,
} from '@agiri/shared';
import { geminiApiKey, generateJsonResponse, generateImage } from '../lib/gemini';
import { verifyAuth } from '../lib/auth';

interface BokeResult {
	intermediateThought: string;
	boke: string;
}

interface JudgeScoreEntry {
	uid: string;
	score: number;
	judgeComments: string;
}

async function generateBoke(
	odai: string,
	name: string,
	profile: { style: string; brainData: { traits: string[]; keywords: string[] } },
): Promise<BokeResult> {
	const prompt = `あなたは「${name}」という名前の大喜利AIです。
スタイル: ${profile.style}
特徴: ${profile.brainData.traits.join('、') || 'なし'}
好むキーワード: ${profile.brainData.keywords.join('、') || 'なし'}

以下のお題に対してボケてください。あなたのスタイルと個性を最大限に活かした回答をしてください。

お題: ${odai}

まず思考過程を示し、その後ボケを出してください。
JSONで出力: {"intermediateThought": "思考過程", "boke": "ボケの回答"}`;

	return generateJsonResponse<BokeResult>(prompt);
}

async function judgeRound(
	odai: string,
	judge: Judge,
	entries: Array<{ uid: string; name: string; boke: string }>,
): Promise<JudgeScoreEntry[]> {
	const prompt = `あなたは「${judge.name}」という大喜利の審査員です。
あなたの個性: ${judge.personality}
審査基準: ${judge.criteria}

お題: ${odai}

以下の回答を審査してください：
${entries.map((e, i) => `${i + 1}. ${e.name}: 「${e.boke}」`).join('\n')}

各回答に1〜10点のスコアをつけ、あなたのキャラクターに応じた個性的なコメントをつけてください。
JSONで出力: {"scores": [${entries.map((e) => `{"uid": "${e.uid}", "score": 数値, "judgeComments": "コメント"}`).join(', ')}]}`;

	const result = await generateJsonResponse<{ scores: JudgeScoreEntry[] }>(prompt);
	for (const s of result.scores) {
		s.score = Math.max(1, Math.min(10, Math.round(s.score)));
	}
	return result.scores;
}

async function executeRound(
	roundNumber: number,
	userUid: string,
	userName: string,
	userProfile: AgentProfile,
	opponent: DummyAgent,
	opponentUid: string,
	judge: Judge,
): Promise<Round> {
	const odaiResult = await generateJsonResponse<{ odai: string }>(
		'大喜利のお題を1つ生成してください。30文字以内で。バラエティ豊かに。JSONで出力: {"odai": "お題"}',
	);
	const odai = odaiResult.odai;

	const [userBoke, opponentBoke] = await Promise.all([
		generateBoke(odai, userName, userProfile),
		generateBoke(odai, opponent.name, {
			style: opponent.style,
			brainData: opponent.brainData,
		}),
	]);

	const scores = await judgeRound(odai, judge, [
		{ uid: userUid, name: userName, boke: userBoke.boke },
		{ uid: opponentUid, name: opponent.name, boke: opponentBoke.boke },
	]);

	const results: RoundResult[] = [
		{
			uid: userUid,
			agentName: userName,
			boke: userBoke.boke,
			score: scores.find((s) => s.uid === userUid)?.score ?? 5,
			intermediateThought: userBoke.intermediateThought,
			judgeComments: scores.find((s) => s.uid === userUid)?.judgeComments ?? '',
		},
		{
			uid: opponentUid,
			agentName: opponent.name,
			boke: opponentBoke.boke,
			score: scores.find((s) => s.uid === opponentUid)?.score ?? 5,
			intermediateThought: opponentBoke.intermediateThought,
			judgeComments:
				scores.find((s) => s.uid === opponentUid)?.judgeComments ?? '',
		},
	];

	return { roundNumber, odai, results };
}

export const runBattle = onRequest(
	{ timeoutSeconds: 120, cors: true, secrets: [geminiApiKey] },
	async (req, res) => {
		const uid = await verifyAuth(req, res);
		if (!uid) return;
		if (req.method !== 'POST') {
			res.status(405).json({ error: 'Method not allowed' });
			return;
		}

		try {
			const db = getFirestore();

			// 1. Get user agent
			const agentDoc = await db.collection('agents').doc(uid).get();
			if (!agentDoc.exists) {
				res.status(404).json({ error: 'Agent not found' });
				return;
			}
			const userAgent = agentDoc.data() as AgentProfile;
			const userName = userAgent.name || 'プレイヤー';

			// 2. Pick random opponent
			const dummyAgentsDoc = await db.collection('meta').doc('dummyAgents').get();
			const dummyAgents = (dummyAgentsDoc.data()?.agents ?? []) as DummyAgent[];
			if (dummyAgents.length === 0) {
				res.status(500).json({ error: 'No opponents available' });
				return;
			}
			const opponent =
				dummyAgents[Math.floor(Math.random() * dummyAgents.length)]!;
			const opponentUid = `dummy_${opponent.name}`;

			// 3. Pick random judge
			const judgesDoc = await db.collection('meta').doc('judges').get();
			const judges = (judgesDoc.data()?.judges ?? []) as Judge[];
			if (judges.length === 0) {
				res.status(500).json({ error: 'No judges available' });
				return;
			}
			const judge = judges[Math.floor(Math.random() * judges.length)]!;

			// 4. Create battle document
			const battleRef = db.collection('battles').doc();
			const battleId = battleRef.id;
			await battleRef.set({
				status: 'processing',
				createdAt: FieldValue.serverTimestamp(),
				playerUids: [uid, opponentUid],
				judgeName: judge.name,
				rounds: [],
				totalScores: {},
				winnerUid: '',
				winnerBoke: '',
				winnerImageUrl: null,
			});

			// 5. Round 1
			const round1 = await executeRound(
				1,
				uid,
				userName,
				userAgent,
				opponent,
				opponentUid,
				judge,
			);
			await battleRef.update({
				status: 'round1_done',
				rounds: [round1],
			});

			// 6. Round 2
			const round2 = await executeRound(
				2,
				uid,
				userName,
				userAgent,
				opponent,
				opponentUid,
				judge,
			);
			await battleRef.update({
				status: 'round2_done',
				rounds: [round1, round2],
			});

			// 7. Calculate total scores
			const totalScores: Record<string, number> = {};
			for (const round of [round1, round2]) {
				for (const result of round.results) {
					totalScores[result.uid] = (totalScores[result.uid] ?? 0) + result.score;
				}
			}

			// Determine winner (user wins ties)
			const winnerUid =
				(totalScores[uid] ?? 0) >= (totalScores[opponentUid] ?? 0)
					? uid
					: opponentUid;
			const winnerBoke =
				[round1, round2]
					.flatMap((r) => r.results)
					.filter((r) => r.uid === winnerUid)
					.sort((a, b) => b.score - a.score)[0]?.boke ?? '';

			// 8. Generate winner image (best effort)
			let winnerImageUrl: string | null = null;
			try {
				const imageData = await generateImage(
					`大喜利の優勝作品をイメージした楽しいイラスト。テーマ: ${winnerBoke}`,
				);
				if (imageData && imageData.length < 1_000_000) {
					winnerImageUrl = imageData;
				}
			} catch (e) {
				console.warn('Image generation failed, skipping:', e);
			}

			// 9. Final update
			await battleRef.update({
				status: 'done',
				totalScores,
				winnerUid,
				winnerBoke,
				winnerImageUrl,
			});

			// 10. Update user stats
			const isUserWinner = winnerUid === uid;
			await db
				.collection('agents')
				.doc(uid)
				.update({
					[`stats.${isUserWinner ? 'wins' : 'losses'}`]:
						FieldValue.increment(1),
					level: FieldValue.increment(1),
				});

			// 11. Return battleId
			const response: RunBattleResponse = { battleId };
			res.json(response);
		} catch (error) {
			console.error('runBattle error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
);
