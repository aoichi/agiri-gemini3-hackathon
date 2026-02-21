'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
	user: User | null;
	uid: string | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	uid: null,
	loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		return onAuthStateChanged(auth, (u) => {
			setUser(u);
			setLoading(false);
		});
	}, []);

	return (
		<AuthContext.Provider value={{ user, uid: user?.uid ?? null, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
