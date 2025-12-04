import { IAdminType } from "./IAdminType";
import { IAthlete } from "./IAthleteType";
import { ITeamType } from "./ITeamType";

/**
 * Interface for Signing document
 * Tracks verified athlete signings to teams
 */
export default interface ISigning {
  _id?: string;
  athlete: IAthlete;
  team: ITeamType;
  signedDate: Date;
  admin: IAdminType;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
