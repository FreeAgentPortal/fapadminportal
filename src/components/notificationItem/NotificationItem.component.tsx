import NotificationType from '@/types/NotificationType';
import styles from './NotificationItem.module.scss'; 
import Link from 'next/link';
import React from 'react';
import getNotificationLink from '@/utils/getNotificationLink';
import { Avatar } from 'antd';
import useApiHook from '@/hooks/useApi';
import dayjs from 'dayjs';

interface Props {
  notification: NotificationType;
  small?: boolean;
}
const NotificationItem = ({ notification, small = false }: Props) => {
  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ['notifications'],
    method: 'PUT',
    key: 'notification',
    url: notification._id !== '' ? `/notification/${notification._id}` : `/notification/all`,
  }) as any;
  return (
    <>
      <Link
        className={`${styles.container} ${!notification?.opened ? styles.unread : ''}`}
        href={getNotificationLink(notification)}
        key={notification.entityId}
        onClick={() => {
          updateNotification({
            formData: { opened: true },
          });
        }}
      >
        <div className={styles.content}>
          <div className={styles.titleContainer}>
            <Avatar size="small" src={notification?.userFrom?.profileImageUrl} />

            <h1 className={`${styles.title}  ${small ? styles.small : ''}`}>{notification.message}</h1>
          </div>

          <p className={`${styles.description} ${small ? styles.small : ''}`}>{notification.description}</p>
        </div>
        <div className={styles.date}>{dayjs(notification?.createdAt).format('MM/DD/YYYY').toString()}</div>
      </Link>
    </>
  );
};

export default NotificationItem;
