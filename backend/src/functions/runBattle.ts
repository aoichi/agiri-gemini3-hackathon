import { onRequest } from 'firebase-functions/v2/https';
import type { RunBattleResponse } from '@agiri/shared';

export const runBattle = onRequest(async (req, res) => {
	// TODO: バトルロジック実装
	// processing → round1_done → round2_done → done
	const response: RunBattleResponse = {
		battleId: '',
	};
	res.json(response);
});
