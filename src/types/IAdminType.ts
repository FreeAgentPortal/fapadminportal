import User from "./User";

export interface IAdminType {
  _id: string;
  user: User;
  role: ('admin' | 'moderator' | 'developer' | 'support')[];
  permissions: string[]; // for fine-grained ACL
  createdAt: Date;
  updatedAt: Date;
}