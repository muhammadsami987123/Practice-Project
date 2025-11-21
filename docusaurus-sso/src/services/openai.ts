import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface UserProficiency {
    aiProficiency: 'Beginner' | 'Intermediate' | 'Expert';
    programmingProficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

/**
 * Generate a summary of the lesson content using OpenAI
 */
export async function generateLessonSummary(
    lessonContent: string,
    lessonTitle: string
): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert technical writer and educator. Your task is to create concise, 
          clear summaries of technical documentation and tutorials. Focus on key concepts, main takeaways, 
          and practical applications. Use markdown formatting for better readability.`,
                },
                {
                    role: 'user',
                    content: `Please create a comprehensive summary of the following lesson titled "${lessonTitle}":

${lessonContent}

The summary should:
- Highlight the main concepts and key takeaways
- Be concise but comprehensive (aim for 30-40% of original length)
- Use bullet points and headings for clarity
- Include code examples if present in the original
- Be formatted in markdown`,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        return response.choices[0]?.message?.content || 'Summary generation failed';
    } catch (error) {
        console.error('Error generating summary:', error);
        throw new Error('Failed to generate summary');
    }
}

/**
 * Generate personalized content based on user's proficiency levels
 */
export async function generatePersonalizedContent(
    lessonContent: string,
    lessonTitle: string,
    userProficiency: UserProficiency
): Promise<string> {
    try {
        const proficiencyContext = buildProficiencyContext(userProficiency);

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an adaptive learning AI that personalizes educational content based on 
          the learner's proficiency level. You adjust the depth, complexity, and examples to match 
          the user's experience level while maintaining engagement and educational value.`,
                },
                {
                    role: 'user',
                    content: `Please personalize the following lesson titled "${lessonTitle}" for a learner with these characteristics:

${proficiencyContext}

Original Lesson Content:
${lessonContent}

Personalization Guidelines:
- Adjust technical depth and complexity to match their proficiency levels
- Add or simplify explanations based on their experience
- Include relevant examples and analogies appropriate for their level
- For beginners: Add more context, simpler explanations, and foundational concepts
- For intermediate: Balance theory and practice, include real-world scenarios
- For experts: Focus on advanced concepts, edge cases, and optimization
- Maintain the core learning objectives while adapting the presentation
- Use markdown formatting for better readability`,
                },
            ],
            temperature: 0.8,
            max_tokens: 3000,
        });

        return response.choices[0]?.message?.content || 'Personalization failed';
    } catch (error) {
        console.error('Error generating personalized content:', error);
        throw new Error('Failed to generate personalized content');
    }
}

/**
 * Build a context string describing the user's proficiency levels
 */
function buildProficiencyContext(proficiency: UserProficiency): string {
    const aiLevel = proficiency.aiProficiency;
    const progLevel = proficiency.programmingProficiency;

    const aiDescriptions = {
        Beginner: 'new to AI and machine learning concepts, needs foundational explanations',
        Intermediate: 'familiar with AI basics and has some practical experience',
        Expert: 'deep understanding of AI/ML with extensive hands-on experience',
    };

    const progDescriptions = {
        Beginner: 'learning to code, needs clear explanations of programming concepts',
        Intermediate: 'comfortable with programming, understands multiple languages and paradigms',
        Expert: 'professional developer with years of experience and deep technical knowledge',
    };

    return `AI Proficiency: ${aiLevel} - ${aiDescriptions[aiLevel]}
Programming Proficiency: ${progLevel} - ${progDescriptions[progLevel]}`;
}

/**
 * Generate content using streaming for real-time updates (optional enhancement)
 */
export async function generatePersonalizedContentStream(
    lessonContent: string,
    lessonTitle: string,
    userProficiency: UserProficiency,
    onChunk: (chunk: string) => void
): Promise<void> {
    try {
        const proficiencyContext = buildProficiencyContext(userProficiency);

        const stream = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an adaptive learning AI that personalizes educational content.`,
                },
                {
                    role: 'user',
                    content: `Personalize this lesson for: ${proficiencyContext}\n\nLesson: ${lessonTitle}\n\n${lessonContent}`,
                },
            ],
            temperature: 0.8,
            max_tokens: 3000,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                onChunk(content);
            }
        }
    } catch (error) {
        console.error('Error in streaming generation:', error);
        throw new Error('Failed to generate personalized content');
    }
}
