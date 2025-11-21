import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './LessonTabs.module.css';

interface LessonTabsProps {
    lessonId: string;
    originalContent: string;
}

type TabType = 'original' | 'summarize' | 'personalized';

export default function LessonTabs({ lessonId, originalContent }: LessonTabsProps): JSX.Element {
    const [activeTab, setActiveTab] = useState<TabType>('original');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [summary, setSummary] = useState<string>('');
    const [personalizedContent, setPersonalizedContent] = useState<string>('');
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingPersonalized, setLoadingPersonalized] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (activeTab === 'summarize' && isAuthenticated && !summary) {
            loadSummary();
        }
        if (activeTab === 'personalized' && isAuthenticated && !personalizedContent) {
            loadPersonalizedContent();
        }
    }, [activeTab, isAuthenticated]);

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/session', {
                credentials: 'include',
            });
            setIsAuthenticated(response.ok);
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };

    const loadSummary = async () => {
        setLoadingSummary(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3001/api/lessons/${lessonId}/summary`, {
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                if (response.status === 401) {
                    throw new Error('Authentication required. Please sign in.');
                } else if (response.status === 404) {
                    throw new Error(`Lesson "${lessonId}" not found in database. Please ensure the lesson exists.`);
                } else if (response.status === 500) {
                    throw new Error(errorData.error || 'Server error. Please check server logs and ensure OPENAI_API_KEY is set.');
                }
                throw new Error(errorData.error || `Failed to load summary (${response.status})`);
            }
            
            const data = await response.json();
            if (!data.summary) {
                throw new Error('Summary data is empty');
            }
            setSummary(data.summary);
        } catch (err: any) {
            // Handle network errors
            if (err.message?.includes('fetch') || err.message?.includes('Failed to fetch')) {
                setError('Cannot connect to server. Please ensure the API server is running on http://localhost:3001');
            } else {
                setError(err.message || 'Failed to load summary. Please try again.');
            }
            console.error('Summary load error:', err);
        } finally {
            setLoadingSummary(false);
        }
    };

    const loadPersonalizedContent = async () => {
        setLoadingPersonalized(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3001/api/lessons/${lessonId}/personalized`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                if (response.status === 401) {
                    throw new Error('Authentication required. Please sign in.');
                } else if (response.status === 400) {
                    throw new Error(errorData.error || 'Please complete onboarding first.');
                } else if (response.status === 404) {
                    throw new Error(`Lesson "${lessonId}" not found in database. Please ensure the lesson exists.`);
                } else if (response.status === 500) {
                    throw new Error(errorData.error || 'Server error. Please check server logs and ensure OPENAI_API_KEY is set.');
                }
                throw new Error(errorData.error || `Failed to load personalized content (${response.status})`);
            }

            const data = await response.json();
            if (!data.content) {
                throw new Error('Personalized content is empty');
            }
            setPersonalizedContent(data.content);
        } catch (err: any) {
            if (err.message?.includes('fetch') || err.message?.includes('Failed to fetch')) {
                setError('Cannot connect to server. Please ensure the API server is running on http://localhost:3001');
            } else {
                setError(err.message || 'Failed to load personalized content. Please try again.');
            }
            console.error('Personalized content error:', err);
        } finally {
            setLoadingPersonalized(false);
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'original') {
            return (
                <div className={styles.content}>
                    <div dangerouslySetInnerHTML={{ __html: originalContent }} />
                </div>
            );
        }

        if (!isAuthenticated) {
            return (
                <div className={styles.authRequired}>
                    <div className={styles.authIcon}>🔒</div>
                    <h3>Authentication Required</h3>
                    <p>Please sign in to access {activeTab === 'summarize' ? 'summarized' : 'personalized'} content.</p>
                    <a href="/auth/signin" className={styles.signInLink}>
                        Sign In to Continue
                    </a>
                </div>
            );
        }

        if (activeTab === 'summarize') {
            if (loadingSummary) {
                return (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Generating AI-powered summary...</p>
                    </div>
                );
            }
            return (
                <div className={styles.content}>
                    {error ? (
                        <div className={styles.error}>
                            <strong>Error:</strong> {error}
                            <button 
                                onClick={loadSummary} 
                                style={{ 
                                    marginTop: '1rem', 
                                    padding: '0.5rem 1rem', 
                                    cursor: 'pointer',
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className={styles.markdownContent}>
                            {summary}
                        </ReactMarkdown>
                    )}
                </div>
            );
        }

        if (activeTab === 'personalized') {
            if (loadingPersonalized) {
                return (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Creating personalized content based on your proficiency level...</p>
                    </div>
                );
            }
            return (
                <div className={styles.content}>
                    {error ? (
                        <div className={styles.error}>
                            <strong>Error:</strong> {error}
                            <button
                                onClick={loadPersonalizedContent}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className={styles.markdownContent}>
                            {personalizedContent}
                        </ReactMarkdown>
                    )}
                </div>
            );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'original' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('original')}
                >
                    <span className={styles.tabIcon}>📄</span>
                    Original
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'summarize' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('summarize')}
                >
                    <span className={styles.tabIcon}>✨</span>
                    Summarize
                    {!isAuthenticated && <span className={styles.lockBadge}>🔒</span>}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'personalized' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('personalized')}
                >
                    <span className={styles.tabIcon}>🎯</span>
                    Personalized
                    {!isAuthenticated && <span className={styles.lockBadge}>🔒</span>}
                </button>
            </div>
            <div className={styles.tabContent}>
                {renderTabContent()}
            </div>
        </div>
    );
}
