import React, { useState, useEffect } from 'react';
import styles from './AuthButton.module.css';

interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
}

export default function AuthButton(): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/session', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch('http://localhost:3001/api/auth/sign-out', {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    if (loading) {
        return <div className={styles.loading}>...</div>;
    }

    if (!user) {
        return (
            <a href="/auth/signin" className={styles.signInButton}>
                Sign In
            </a>
        );
    }

    return (
        <div className={styles.userMenu}>
            <button
                className={styles.userButton}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {user.image ? (
                    <img src={user.image} alt={user.name || 'User'} className={styles.avatar} />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                )}
                <span className={styles.userName}>{user.name || user.email}</span>
            </button>

            {showDropdown && (
                <div className={styles.dropdown}>
                    <a href="/profile" className={styles.dropdownItem}>
                        Profile
                    </a>
                    <button onClick={handleSignOut} className={styles.dropdownItem}>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
