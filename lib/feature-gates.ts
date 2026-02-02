export interface PlanFeatures {
  maxLinks: number
  maxForms: number
  maxFiles: number
  customDomain: boolean
  removebranding: boolean
  analytics: boolean
  qrCodes: boolean
  premiumThemes: boolean
  apiAccess: boolean
  prioritySupport: boolean
}

export const PLAN_FEATURES: Record<string, PlanFeatures> = {
  free: {
    maxLinks: 5,
    maxForms: 2,
    maxFiles: 5,
    customDomain: false,
    removebranding: false,
    analytics: false,
    qrCodes: true,
    premiumThemes: false,
    apiAccess: false,
    prioritySupport: false,
  },
  pro: {
    maxLinks: -1, // unlimited
    maxForms: -1,
    maxFiles: 50,
    customDomain: false,
    removebranding: true,
    analytics: true,
    qrCodes: true,
    premiumThemes: true,
    apiAccess: false,
    prioritySupport: true,
  },
  business: {
    maxLinks: -1,
    maxForms: -1,
    maxFiles: -1,
    customDomain: true,
    removebranding: true,
    analytics: true,
    qrCodes: true,
    premiumThemes: true,
    apiAccess: true,
    prioritySupport: true,
  },
}

export function canAccessFeature(
  feature: keyof PlanFeatures,
  userPlan: string
): boolean {
  const planFeatures = PLAN_FEATURES[userPlan] || PLAN_FEATURES.free
  return planFeatures[feature] as boolean
}

export function getFeatureLimit(
  feature: "maxLinks" | "maxForms" | "maxFiles",
  userPlan: string
): number {
  const planFeatures = PLAN_FEATURES[userPlan] || PLAN_FEATURES.free
  return planFeatures[feature]
}

export function hasReachedLimit(
  feature: "maxLinks" | "maxForms" | "maxFiles",
  currentCount: number,
  userPlan: string
): boolean {
  const limit = getFeatureLimit(feature, userPlan)
  if (limit === -1) return false // unlimited
  return currentCount >= limit
}
