import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './profile.module.css';

interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    proficiencyData?: {
        aiProficiency: string;
        programmingProficiency: string;
    };
    hasCompletedOnboarding: boolean;
}

export default function Profile() {
    const { siteConfig } = useDocusaurusContext();
    const apiUrl = siteConfig.customFields?.apiUrl as string;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/auth/session`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    window.location.href = '/auth/signin';
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [apiUrl]);

    if (loading) {
        return (
            <Layout title="Profile">
                <div className={styles.loading}>Loading profile...</div>
            </Layout>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <Layout title="My Profile" description="User profile page">
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    <div className={styles.header}>
                        {user.image ? (
                            <img src={user.image} alt={user.name || 'User'} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {(user.name || user.email).charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className={styles.userInfo}>
                            <h1>{user.name || 'User'}</h1>
                            <p className={styles.email}>{user.email}</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Proficiency Profile</h2>
                        <div className={styles.grid}>
                            <div className={styles.infoCard}>
                                <span className={styles.label}>AI Proficiency</span>
                                <div className={styles.value}>
                                    {user.proficiencyData?.aiProficiency || 'Not set'}
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <span className={styles.label}>Programming Proficiency</span>
                                <div className={styles.value}>
                                    {user.proficiencyData?.programmingProficiency || 'Not set'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Account Status</h2>
                        <div className={styles.grid}>
                            <div className={styles.infoCard}>
                                <span className={styles.label}>Onboarding</span>
                                <div className={styles.value}>
                                    {user.hasCompletedOnboarding ? 'Completed ✅' : 'Pending ⏳'}
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <span className={styles.label}>User ID</span>
                                <div className={styles.value} style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>
                                    {user.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
