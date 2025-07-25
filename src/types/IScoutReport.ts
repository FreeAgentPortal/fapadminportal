import { IAdminType } from "./IAdminType";
import { IAthlete } from "./IAthleteType";

export interface IScoutReport {
  _id: string;
  athleteId: IAthlete;
  scoutId: IAdminType;
  sport: string;
  league: string;
  reportType: "game" | "evaluation" | "camp" | "combine" | "interview" | "other";
  diamondRating: number; // number set automatically by aggregation
  ratingBreakdown: {
    athleticism: {
      // speed, strength, agility
      score: number;
      comments?: string;
    };
    technique: {
      // skills, form, mechanics
      score: number;
      comments?: string;
    };
    iq: {
      // mental game, decision making, game awareness
      score: number;
      comments?: string;
    };
    workEthic: {
      // effort, hustle, practice habits
      score: number;
      comments?: string;
    };
    potential: {
      // future upside, growth potential
      score: number;
      comments?: string;
    };
    durability: {
      // injury history, physical resilience
      score: number;
      comments?: string;
    };
  };
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
