import { IActivity } from "./IActivity";
import User from "./User";

export interface IComment {
  _id: string;
  postId: string;
  post: IActivity;
  userId: string;
  content: string;
  authorName: string;
  authorAvatarUrl?: string;
  moderation: {
    status: 'pending' | 'approved' | 'flagged' | 'removed';
    flaggedBy: User[];
    flagReason: string;
    moderatedBy?: User;
    moderatedAt?: string;
  }
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}