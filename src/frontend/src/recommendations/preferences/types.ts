export interface RecommendationPreferences {
  maxMinutesPerDay: Record<string, number>;
  quietHoursStart: number;
  quietHoursEnd: number;
  dismissedRecommendations: string[];
}

export const defaultPreferences: RecommendationPreferences = {
  maxMinutesPerDay: {
    entertainment: 120,
    social: 60,
  },
  quietHoursStart: 22,
  quietHoursEnd: 8,
  dismissedRecommendations: [],
};
