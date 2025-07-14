import { IAthlete } from "./IAthleteType";
import { ISearchPreferences } from "./ISearchPreferences";

export interface ISearchReport {
  _id: string;
  searchPreference: ISearchPreferences; // Reference to the search preference
  // results can be an empty array if no athletes match the search criteria
  results: IAthlete[]; // Array of athletes that match the search
  generatedAt: Date; // When the report was generated
  reportId: string; // Unique identifier for the report
  ownerId: string; // Reference to the resource owner (team/scout/agent etc.)
  ownerType: 'team' | 'scout' | 'agent'; // Type of the owner
  opened: boolean; // Whether the report has been opened by the user
  createdAt: Date;
  updatedAt: Date;
}
