import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './admin.module.css';

interface TableData {
    name: string;
    columns: string[];
    rows: any[];
}

export default function AdminDashboard(): JSX.Element {
    const [tables, setTables] = useState<TableData[]>([]);
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        checkAdminAccess();
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            loadTables();
        }
    }, [isLoggedIn]);

    const checkAdminAccess = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/admin/check', {
                credentials: 'include',
            });
            if (response.ok) {
                setIsLoggedIn(true);
                setIsAdmin(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setIsLoggedIn(true);
                setIsAdmin(true);
            } else {
                const data = await response.json();
                setLoginError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setLoginError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const loadTables = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/admin/tables', {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to load tables');
            const data = await response.json();
            setTables(data.tables);
            if (data.tables.length > 0) {
                setSelectedTable(data.tables[0].name);
            }
        } catch (err) {
            setError('Failed to load database tables.');
        } finally {
            setLoading(false);
        }
    };

    const refreshTable = async (tableName: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/admin/tables/${tableName}`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to refresh table');
            const data = await response.json();

            setTables(prev =>
                prev.map(table =>
                    table.name === tableName
                        ? { ...table, rows: data.rows, columns: data.columns }
                        : table
                )
            );
        } catch (err) {
            setError(`Failed to refresh ${tableName} table.`);
        }
    };

    if (loading && !isLoggedIn) {
        return (
            <Layout title="Admin Dashboard" description="Database management">
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!isLoggedIn) {
        return (
            <Layout title="Admin Dashboard" description="Database management">
                <div className={styles.container}>
                    <div className={styles.loginContainer}>
                        <div className={styles.loginBox}>
                            <h1 className={styles.loginTitle}>
                                <span className={styles.icon}>🔒</span>
                                Admin Login
                            </h1>
                            <p className={styles.loginSubtitle}>Enter your credentials to access the admin dashboard</p>
                            <form onSubmit={handleLogin} className={styles.loginForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                {loginError && <div className={styles.error}>{loginError}</div>}
                                <button type="submit" className={styles.loginButton} disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!isAdmin) {
        return (
            <Layout title="Admin Dashboard" description="Database management">
                <div className={styles.container}>
                    <div className={styles.accessDenied}>
                        <div className={styles.icon}>🔒</div>
                        <h1>Access Denied</h1>
                        <p>{error || 'You do not have permission to access this page.'}</p>
                        <a href="/" className={styles.homeLink}>Return to Home</a>
                    </div>
                </div>
            </Layout>
        );
    }

    const currentTable = tables.find(t => t.name === selectedTable);

    return (
        <Layout title="Admin Dashboard" description="Database management">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        <span className={styles.icon}>⚙️</span>
                        Admin Dashboard
                    </h1>
                    <p className={styles.subtitle}>Database Management & Analytics</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.sidebar}>
                        <h3 className={styles.sidebarTitle}>Database Tables</h3>
                        <div className={styles.tableList}>
                            {tables.map(table => (
                                <button
                                    key={table.name}
                                    className={`${styles.tableButton} ${selectedTable === table.name ? styles.tableButtonActive : ''
                                        }`}
                                    onClick={() => setSelectedTable(table.name)}
                                >
                                    <span className={styles.tableName}>{table.name}</span>
                                    <span className={styles.rowCount}>{table.rows.length} rows</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.main}>
                        {currentTable && (
                            <>
                                <div className={styles.tableHeader}>
                                    <h2 className={styles.tableTitleMain}>{currentTable.name}</h2>
                                    <button
                                        className={styles.refreshButton}
                                        onClick={() => refreshTable(currentTable.name)}
                                    >
                                        🔄 Refresh
                                    </button>
                                </div>

                                <div className={styles.tableWrapper}>
                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                {currentTable.columns.map(col => (
                                                    <th key={col}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentTable.rows.length === 0 ? (
                                                <tr>
                                                    <td colSpan={currentTable.columns.length} className={styles.emptyState}>
                                                        No data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentTable.rows.map((row, idx) => (
                                                    <tr key={idx}>
                                                        {currentTable.columns.map(col => (
                                                            <td key={col}>
                                                                {typeof row[col] === 'object'
                                                                    ? JSON.stringify(row[col])
                                                                    : String(row[col] ?? '')}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className={styles.tableStats}>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Total Rows:</span>
                                        <span className={styles.statValue}>{currentTable.rows.length}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Columns:</span>
                                        <span className={styles.statValue}>{currentTable.columns.length}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div className={styles.errorBanner}>
                        {error}
                    </div>
                )}
            </div>
        </Layout>
    );
}
