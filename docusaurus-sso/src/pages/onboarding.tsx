import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './onboarding.module.css';

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Expert';

export default function Onboarding(): JSX.Element {
    const [aiProficiency, setAiProficiency] = useState<ProficiencyLevel>('Beginner');
    const [programmingProficiency, setProgrammingProficiency] = useState<ProficiencyLevel>('Beginner');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/user/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    aiProficiency,
                    programmingProficiency,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save onboarding data');
            }

            // Redirect to home page after successful onboarding
            window.location.href = '/';
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const ProficiencyCard = ({
        level,
        selected,
        onClick,
        title,
        description
    }: {
        level: ProficiencyLevel;
        selected: boolean;
        onClick: () => void;
        title: string;
        description: string;
    }) => (
        <div
            className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
            onClick={onClick}
        >
            <div className={styles.cardIcon}>
                {level === 'Beginner' && '🌱'}
                {level === 'Intermediate' && '🚀'}
                {level === 'Expert' && '⭐'}
            </div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
        </div>
    );

    return (
        <Layout title="Welcome - Complete Your Profile" description="Set up your learning preferences">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Welcome! Let's personalize your experience</h1>
                        <p className={styles.subtitle}>
                            Tell us about your experience level to get personalized content
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* AI Proficiency Section */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>AI Proficiency Level</h2>
                            <p className={styles.sectionDescription}>
                                How familiar are you with AI and machine learning concepts?
                            </p>
                            <div className={styles.cardGrid}>
                                <ProficiencyCard
                                    level="Beginner"
                                    selected={aiProficiency === 'Beginner'}
                                    onClick={() => setAiProficiency('Beginner')}
                                    title="Beginner"
                                    description="New to AI and eager to learn the basics"
                                />
                                <ProficiencyCard
                                    level="Intermediate"
                                    selected={aiProficiency === 'Intermediate'}
                                    onClick={() => setAiProficiency('Intermediate')}
                                    title="Intermediate"
                                    description="Familiar with AI concepts and some practical experience"
                                />
                                <ProficiencyCard
                                    level="Expert"
                                    selected={aiProficiency === 'Expert'}
                                    onClick={() => setAiProficiency('Expert')}
                                    title="Expert"
                                    description="Deep understanding and extensive hands-on experience"
                                />
                            </div>
                        </div>

                        {/* Programming Proficiency Section */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Programming Proficiency Level</h2>
                            <p className={styles.sectionDescription}>
                                What's your experience with programming and software development?
                            </p>
                            <div className={styles.cardGrid}>
                                <ProficiencyCard
                                    level="Beginner"
                                    selected={programmingProficiency === 'Beginner'}
                                    onClick={() => setProgrammingProficiency('Beginner')}
                                    title="Beginner"
                                    description="Just starting my coding journey"
                                />
                                <ProficiencyCard
                                    level="Intermediate"
                                    selected={programmingProficiency === 'Intermediate'}
                                    onClick={() => setProgrammingProficiency('Intermediate')}
                                    title="Intermediate"
                                    description="Comfortable with multiple languages and frameworks"
                                />
                                <ProficiencyCard
                                    level="Expert"
                                    selected={programmingProficiency === 'Expert'}
                                    onClick={() => setProgrammingProficiency('Expert')}
                                    title="Expert"
                                    description="Professional developer with years of experience"
                                />
                            </div>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Complete Setup'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
