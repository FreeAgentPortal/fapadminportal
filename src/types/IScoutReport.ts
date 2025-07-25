import { IAdminType } from "./IAdminType";
import { IAthlete } from "./IAthleteType";

export interface IRatingField {
  score: number;
  comments?: string;
}

export interface IScoutReport {
  _id: string;
  athleteId: IAthlete;
  scoutId: IAdminType;
  sport: string;
  league: string;
  reportType: "game" | "evaluation" | "camp" | "combine" | "interview" | "other";
  diamondRating: number; // number set automatically by aggregation
  /**
   * Dynamic rating breakdown object that can contain any number of rating fields
   * Each field is a key-value pair where the key is the field name (e.g., 'athleticism', 'technique')
   * and the value is an IRatingField object with score and optional comments
   *
   * Example:
   * {
   *   "athleticism": { score: 4, comments: "Excellent speed and agility" },
   *   "technique": { score: 3, comments: "Needs work on fundamentals" },
   *   "customField": { score: 5, comments: "Outstanding in this area" }
   * }
   */
  ratingBreakdown: Record<string, IRatingField>; // Dynamic rating fields
  observations?: string; // detailed notes on performance
  strengths?: string[]; // key strengths observed
  weaknesses?: string[]; // areas for improvement
  verifiedMetrics?: string[]; // metrics that were verified during the report
  unverifiedMetrics?: string[]; // metrics that were not verified
  recommendations?: string; // suggestions for improvement

  //metadata
  tags?: string[]; // tags for categorization
  isPublic?: boolean; // whether the report is public or private, can teams see it? or does it only affect the athlete's rating?
  isFinalized?: boolean; // whether the report is finalized or still draft
  isDraft?: boolean; // whether the report is a draft or ready to be processed
  // timestamps
  createdAt: Date;
  updatedAt: Date;
  scout?: IAdminType;
  athlete?: IAthlete;
}
