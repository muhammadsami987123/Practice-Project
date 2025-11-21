import { db, lessons, tenants } from '../src/db';

async function createTestLesson() {
    console.log('📝 Creating test lesson...');

    try {
        // Get default tenant
        const defaultTenant = await db.select().from(tenants).limit(1);
        const tenantId = defaultTenant[0]?.id || 'default-tenant';

        // Create a test lesson
        const lessonId = 'intro-to-ai-ml';

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

        await db.insert(lessons).values({
            id: lessonId,
            tenantId,
            title: 'Introduction to AI and Machine Learning',
            slug: 'intro-to-ai-ml',
            originalContent: lessonContent,
            summary: null,
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
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
            console.log('ℹ️  Test lesson already exists.');
        } else {
            console.error('❌ Error creating test lesson:', error);
            process.exit(1);
        }
    }
}

createTestLesson();
