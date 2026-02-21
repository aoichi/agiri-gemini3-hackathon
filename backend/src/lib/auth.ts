import { getAuth } from 'firebase-admin/auth';

export async function verifyAuth(
	req: { headers: { authorization?: string } },
	res: { status(code: number): { json(body: unknown): void } },
): Promise<string | null> {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		res.status(401).json({ error: 'Unauthorized' });
		return null;
	}
	try {
		const token = authHeader.split('Bearer ')[1]!;
		const decoded = await getAuth().verifyIdToken(token);
		return decoded.uid;
	} catch {
		res.status(401).json({ error: 'Invalid token' });
		return null;
	}
}
