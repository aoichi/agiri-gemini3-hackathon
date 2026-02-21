'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { getAgent } from '@/lib/firestore';

export default function Root() {
	const router = useRouter();
	const { user, loading } = useAuth();
	const initialized = useRef(false);

	useEffect(() => {
		if (loading) return;

		if (!user) {
			signInAnonymously(auth).catch(console.error);
			return;
		}

		if (initialized.current) return;
		initialized.current = true;

		getAgent(user.uid).then((agent) => {
			router.replace(agent ? '/main' : '/create');
		}).catch(console.error);
	}, [user, loading, router]);

	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center">
			<div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
		</div>
	);
}
