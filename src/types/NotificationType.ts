import UserType from './User';

export default interface NotificationType {
  _id: string;
  notificationType: string;
  message: string;
  userTo: UserType;
  userFrom: UserType;
  entityId: string;
  opened: boolean;
  createdAt: string;
  description: string;
}
