import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { AgentProfile, Battle } from '@agiri/shared';

export async function getAgent(uid: string): Promise<AgentProfile | null> {
	const snap = await getDoc(doc(db, 'agents', uid));
	return snap.exists() ? (snap.data() as AgentProfile) : null;
}

export async function createAgent(uid: string, profile: AgentProfile): Promise<void> {
	await setDoc(doc(db, 'agents', uid), profile);
}

export function subscribeToBattle(
	battleId: string,
	callback: (battle: Battle) => void,
): () => void {
	return onSnapshot(doc(db, 'battles', battleId), (snap) => {
		if (snap.exists()) {
			callback(snap.data() as Battle);
		}
	});
}
