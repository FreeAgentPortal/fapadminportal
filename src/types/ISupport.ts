import User from './User';

export interface ISupportGroup {
  _id: string;
  name: string;
  agents: User[];
  tickets: ISupport[];
  isActive: boolean;
}

export interface ISupport {
  requester: User;
  requesterDetails: {
    email: String;
    fullName: String;
  };
  assignee: User;
  groups: ISupportGroup[];
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: [string];
  dateSolved: Date;
}
