import 'dotenv/config';
import { connectToDatabase, COLLECTIONS } from '../src/db/index.js';
import type { Tenant, Lesson } from '../src/db/schema.js';

async function createTestLesson() {
    console.log('📝 Creating test lesson in MongoDB...');

    try {
        const db = await connectToDatabase();
        const tenantsCollection = db.collection<Tenant>(COLLECTIONS.TENANTS);
        const lessonsCollection = db.collection<Lesson>(COLLECTIONS.LESSONS);

        // Get or create default tenant
        const tenantId = process.env.DEFAULT_TENANT_ID || 'default-tenant';
        let tenant = await tenantsCollection.findOne({ id: tenantId });
        
        if (!tenant) {
            console.log('📝 Creating default tenant...');
            await tenantsCollection.insertOne({
                id: tenantId,
                name: 'Default Tenant',
                domain: 'default',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            tenant = await tenantsCollection.findOne({ id: tenantId });
        }

        // Check if lesson already exists
        const lessonId = 'intro-to-ai-ml';
        const existingLesson = await lessonsCollection.findOne({ id: lessonId });
        
        if (existingLesson) {
            console.log('ℹ️  Test lesson already exists.');
            return;
        }

        // Create the lesson
        const lessonContent = `
      <h2>What is Artificial Intelligence?</h2>
      <p>Artificial Intelligence (AI) is the simulation of human intelligence processes by machines.</p>
      
      <h2>Machine Learning Fundamentals</h2>
      <p>Machine Learning is a subset of AI that focuses on algorithms that improve through experience.</p>
      
      <h3>Types of Machine Learning</h3>
      <ul>
        <li><strong>Supervised Learning</strong>: Learning from labeled data</li>
        <li><strong>Unsupervised Learning</strong>: Finding patterns in unlabeled data</li>
        <li><strong>Reinforcement Learning</strong>: Learning through trial and error</li>
      </ul>
    `;

        await lessonsCollection.insertOne({
            id: lessonId,
            tenantId: tenantId,
            title: 'Introduction to AI and Machine Learning',
            slug: 'intro-to-ai-ml',
            originalContent: lessonContent,
            summaryText: null,
            isSummaryGenerated: false,
            category: 'AI Basics',
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('✅ Test lesson created successfully!');
        console.log(`   Lesson ID: ${lessonId}`);
        console.log(`   Title: Introduction to AI and Machine Learning`);
        console.log(`\nYou can now test the three-tab system with this lesson!\n`);
    } catch (error) {
        console.error('❌ Error creating test lesson:', error);
        process.exit(1);
    }
}

createTestLesson();

