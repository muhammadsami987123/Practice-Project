import { MongoClient, Db, MongoClientOptions } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (db) {
        return db;
    }

    const connectionString = process.env.DATABASE_URL || 'mongodb://localhost:27017/docusaurus_db';
    
    if (!client) {
        // MongoDB Atlas connection options
        const options: MongoClientOptions = {
            // Retry writes for replica sets
            retryWrites: true,
            w: 'majority',
            // Connection pool settings
            maxPoolSize: 10,
            minPoolSize: 5,
            // Timeout settings
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            // Server selection timeout
            serverSelectionTimeoutMS: 30000,
            // TLS/SSL options for MongoDB Atlas
            tls: true,
            tlsAllowInvalidCertificates: false,
            // Heartbeat frequency
            heartbeatFrequencyMS: 10000,
        };

        client = new MongoClient(connectionString, options);
        
        try {
            await client.connect();
            console.log('✅ Connected to MongoDB successfully');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    // Extract database name from connection string
    // Format: mongodb+srv://user:pass@host/dbname or mongodb://host:port/dbname
    let dbName = 'docusaurus_db';
    const urlParts = connectionString.split('/');
    if (urlParts.length > 3) {
        const lastPart = urlParts[urlParts.length - 1];
        dbName = lastPart.split('?')[0] || 'docusaurus_db';
    }
    
    db = client.db(dbName);
    
    // Test the connection
    try {
        await db.admin().ping();
        console.log('✅ MongoDB database ping successful');
    } catch (error) {
        console.error('❌ MongoDB ping failed:', error);
    }
    
    return db;
}

export async function closeDatabaseConnection(): Promise<void> {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}

// Collection names
export const COLLECTIONS = {
    TENANTS: 'tenants',
    USERS: 'users',
    SESSIONS: 'sessions',
    ACCOUNTS: 'accounts',
    VERIFICATION_TOKENS: 'verification_tokens',
    BOOKS: 'books',
    CHAPTERS: 'chapters',
    LESSONS: 'lessons',
    PERSONALIZED_CONTENT: 'personalized_content',
    ADMIN_USERS: 'admin_users',
} as const;

// Initialize database connection on import
connectToDatabase().catch(console.error);
