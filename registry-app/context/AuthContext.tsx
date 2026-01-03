'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    User, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    
    // TODO: specific admin emails, ideally moved to remote config or claims
    const ADMIN_EMAILS = ['admin@cymbal.coffee', 'robedwards@cymbal.coffee'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Allow any authenticated user
                setUser(currentUser);
                setIsAdmin(ADMIN_EMAILS.includes(currentUser.email || ''));
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.push('/signout');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
