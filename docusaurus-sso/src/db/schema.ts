// MongoDB Schema Types (for TypeScript)
// These are type definitions for our MongoDB documents

export interface Tenant {
    _id?: string;
    id: string;
    name: string;
    domain?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    _id?: string;
    id: string;
    tenantId: string;
    email: string;
    name?: string;
    emailVerified: boolean;
    image?: string;
    proficiencyData?: {
        aiProficiency: 'Beginner' | 'Intermediate' | 'Expert';
        programmingProficiency: 'Beginner' | 'Intermediate' | 'Expert';
    };
    hasCompletedOnboarding: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    _id?: string;
    id: string;
    userId: string;
    tenantId: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface Account {
    _id?: string;
    id: string;
    userId: string;
    tenantId: string;
    accountId: string;
    providerId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    createdAt: Date;
}

export interface VerificationToken {
    _id?: string;
    id: string;
    identifier: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface Book {
    _id?: string;
    id: string;
    tenantId: string;
    title: string;
    slug: string;
    description?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Chapter {
    _id?: string;
    id: string;
    tenantId: string;
    bookId: string;
    title: string;
    slug: string;
    description?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Lesson {
    _id?: string;
    id: string;
    tenantId: string;
    chapterId?: string;
    title: string;
    slug: string;
    originalContent: string;
    summaryText?: string;
    isSummaryGenerated: boolean;
    category?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PersonalizedContent {
    _id?: string;
    id: string;
    tenantId: string;
    lessonId: string;
    userId: string;
    content: string;
    isPersonalizedGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminUser {
    _id?: string;
    id: string;
    userId: string;
    tenantId: string;
    role: string;
    createdAt: Date;
}
