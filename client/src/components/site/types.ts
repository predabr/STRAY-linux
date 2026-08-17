import { landingCopy } from "@/i18n/landingCopy";

export type LandingCopy = (typeof landingCopy)[keyof typeof landingCopy];
