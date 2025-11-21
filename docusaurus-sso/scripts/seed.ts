import { db, tenants, users, adminUsers } from '../src/db';

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // Create default tenant
        const defaultTenant = {
            id: 'default-tenant',
            name: 'Default Organization',
            domain: 'localhost',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.insert(tenants).values(defaultTenant);
        console.log('✅ Created default tenant');

        // Create admin user
        const adminUser = {
            id: 'admin-user-1',
            tenantId: 'default-tenant',
            email: 'admin@example.com',
            name: 'Admin User',
            emailVerified: true,
            proficiencyData: {
                aiProficiency: 'Expert' as const,
                programmingProficiency: 'Expert' as const,
            },
            hasCompletedOnboarding: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.insert(users).values(adminUser);
        console.log('✅ Created admin user (email: admin@example.com)');

        // Grant admin privileges
        await db.insert(adminUsers).values({
            id: 'admin-role-1',
            userId: 'admin-user-1',
            tenantId: 'default-tenant',
            role: 'super_admin',
            createdAt: new Date(),
        });
        console.log('✅ Granted admin privileges');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nDefault credentials:');
        console.log('Email: admin@example.com');
        console.log('Note: Set up authentication to create a password\n');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();
