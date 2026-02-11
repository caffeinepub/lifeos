import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type InteractionType = {
    __kind__: "formSubmit";
    formSubmit: null;
} | {
    __kind__: "uiChange";
    uiChange: null;
} | {
    __kind__: "contentView";
    contentView: null;
} | {
    __kind__: "navigation";
    navigation: null;
} | {
    __kind__: "userInput";
    userInput: null;
} | {
    __kind__: "buttonClick";
    buttonClick: null;
} | {
    __kind__: "appSpecific";
    appSpecific: string;
};
export type Time = bigint;
export type UsageContext = {
    __kind__: "social";
    social: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "entertainment";
    entertainment: null;
} | {
    __kind__: "work";
    work: null;
} | {
    __kind__: "exercise";
    exercise: null;
} | {
    __kind__: "study";
    study: null;
};
export interface Event {
    id: string;
    duration?: bigint;
    context?: UsageContext;
    source: Variant_app_browser;
    tags: Array<string>;
    timestamp: Time;
    eventType: string;
}
export interface RoutinePattern {
    context: UsageContext;
    avgDuration: bigint;
    dayOfWeekDistribution: {
        tuesday: bigint;
        wednesday: bigint;
        saturday: bigint;
        thursday: bigint;
        sunday: bigint;
        friday: bigint;
        monday: bigint;
    };
    timeOfDayDistribution: {
        morning: bigint;
        evening: bigint;
        night: bigint;
        afternoon: bigint;
    };
    frequency: bigint;
}
export interface Recommendation {
    title: string;
    urgencyLevel: Variant_low_high_medium;
    historicalPerformance: Array<bigint>;
    confidenceScore: bigint;
    message: string;
    category: string;
}
export interface DetailedEvent {
    id: string;
    additionalData?: string;
    interactionType?: InteractionType;
    deviceDetails?: string;
    duration?: bigint;
    context?: UsageContext;
    pageDetails?: string;
    source: Variant_app_browser;
    tags: Array<string>;
    timestamp: Time;
    eventType: string;
}
export interface UserProfile {
    familyName: string;
    projectCustomer: string;
    onboardingComplete: boolean;
    projectTeamMembers: Array<string>;
    givenName: string;
    company: string;
    companyRole: string;
    project: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_app_browser {
    app = "app",
    browser = "browser"
}
export enum Variant_low_high_medium {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    addDetailedEvent(detailedEvent: DetailedEvent): Promise<void>;
    addRoutinePattern(pattern: RoutinePattern): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAlertsByUrgency(urgency: Variant_low_high_medium): Promise<Array<Recommendation>>;
    getAllData(): Promise<{
        patterns: Array<RoutinePattern>;
        recommendations: Array<Recommendation>;
        events: Array<Event>;
        detailedEvents: Array<DetailedEvent>;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryFrequency(category: UsageContext): Promise<bigint>;
    getCategoryPercentage(category: UsageContext): Promise<bigint>;
    getDetailedEvents(filter: UsageContext | null): Promise<Array<DetailedEvent>>;
    getEvents(filter: UsageContext | null): Promise<Array<Event>>;
    getPaginatedEvents(page: bigint, pageSize: bigint): Promise<Array<Event>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logEvent(event: Event): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRecommendation(rec: Recommendation): Promise<void>;
}
