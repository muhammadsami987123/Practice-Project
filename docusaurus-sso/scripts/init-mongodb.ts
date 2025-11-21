import 'dotenv/config';
import { connectToDatabase, COLLECTIONS } from '../src/db/index.js';
import type { Tenant } from '../src/db/schema.js';

async function initMongoDB() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        const db = await connectToDatabase();
        const tenantsCollection = db.collection<Tenant>(COLLECTIONS.TENANTS);
        
        const tenantId = process.env.DEFAULT_TENANT_ID || 'default-tenant';
        const existing = await tenantsCollection.findOne({ id: tenantId });
        
        if (!existing) {
            console.log('📝 Creating default tenant...');
            await tenantsCollection.insertOne({
                id: tenantId,
                name: 'Default Tenant',
                domain: 'default',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Default tenant created successfully!');
        } else {
            console.log('ℹ️  Default tenant already exists.');
        }
        
        console.log('✅ MongoDB initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing MongoDB:', error);
        process.exit(1);
    }
}

initMongoDB();

