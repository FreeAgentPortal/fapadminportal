import NotificationType from '@/types/NotificationType';

export default (notification: NotificationType) => {
  switch (notification.notificationType) {
    case 'support':
      return `/account_details/support/${notification.entityId}`;
    default:
      return '/';
  }
};
