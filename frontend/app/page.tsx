'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Root() {
	const router = useRouter();
	useEffect(() => {
		// TODO: Firebase Auth signInAnonymously() → getAgent(uid)
		// hasAgent ? '/main' : '/create'
		router.replace('/main');
	}, [router]);

	return <div className="min-h-screen bg-gray-950" />;
}
