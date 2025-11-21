import 'dotenv/config';
import { connectToDatabase, COLLECTIONS } from '../src/db/index.js';
import type { Lesson } from '../src/db/schema.js';

async function verifyLesson() {
    try {
        const db = await connectToDatabase();
        const lessonsCollection = db.collection<Lesson>(COLLECTIONS.LESSONS);
        
        const lessonId = 'intro-to-ai-ml';
        const lesson = await lessonsCollection.findOne({ id: lessonId });
        
        if (lesson) {
            console.log('✅ Lesson found!');
            console.log(`   ID: ${lesson.id}`);
            console.log(`   Title: ${lesson.title}`);
            console.log(`   Slug: ${lesson.slug}`);
            console.log(`   Tenant ID: ${lesson.tenantId}`);
        } else {
            console.log('❌ Lesson not found!');
            console.log('   Searching for all lessons...');
            const allLessons = await lessonsCollection.find({}).toArray();
            console.log(`   Found ${allLessons.length} lessons in database:`);
            allLessons.forEach(l => {
                console.log(`     - ${l.id}: ${l.title}`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

verifyLesson();

