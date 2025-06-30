'use client';
import Container from '@/layout/container/Container.layout';
import styles from './NotificationsView.module.scss';
import Link from 'next/link';
import { Badge, Button, Empty, Skeleton } from 'antd';
import { AiFillDelete, AiFillExclamationCircle } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';
import Error from '@/components/error/Error.component';
import { useState } from 'react';
import getNotificationLink from '@/utils/getNotificationLink';
import NotificationItem from '@/components/notificationItem/NotificationItem.component';
import NotificationType from '@/types/NotificationType';
import useApiHook from '@/hooks/useApi';

const NotificationsView = () => {
  // const { data } = useApiHook({
  //   url: `/notification`,
  //   key: 'notifications',
  //   method: 'GET',
  // });

  const { mutate: updateNotification } = useApiHook({
    queriesToInvalidate: ['notifications'],
    key: 'notifications',
    method: 'POST',
  }) as any;
  return (
    <Container
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1',
            }}
          >
            Notifications
          </span>
          <Button type="primary" onClick={() => updateNotification({ url: '' })}>
            Mark all Read
          </Button>
        </div>
      }
    >
      <div className={styles.notifications}>
        {/* {data?.notifications?.length > 0 ? (
          data?.notifications.map((notification: NotificationType) => {
            return <NotificationItem notification={notification} key={notification.entityId} />;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no notifications" />
        )} */}
      </div>
    </Container>
  );
};

export default NotificationsView;
