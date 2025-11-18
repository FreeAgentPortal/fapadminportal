'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, Button, Tooltip } from 'antd';
import type { TabsProps } from 'antd';
import { EventDocument } from '@/types/IEventType';
import { IoInformationCircleOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdSportsSoccer } from 'react-icons/md';
import { getEventTypeLabel, getStatusColor, isRegistrationOpen } from './utils/eventCardHelpers';
import EventInfoTab from './tabs/eventInfo/EventInfo.tab';
import EventAttendeesTab from './tabs/eventAttendees/EventAttendees.tab';
import RegistrationModal from './modals/registrationModal/RegistrationModal.component';
import styles from './EventDetailCard.module.scss';
import useApiHook from '@/hooks/useApi';

interface EventDetailCardProps {
  event: EventDocument;
}

const EventDetailCard = ({ event }: EventDetailCardProps) => {
  const searchParams = useSearchParams();
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);

  // Check for ?action=register query param and auto-open modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'register' && event.registration?.required && isRegistrationOpen(event)) {
      setRegistrationModalOpen(true);
    }
  }, [searchParams, event]);

  const { data: hasRegistered } = useApiHook({
    method: 'GET',
    key: 'event.hasRegistered',
    url: `/feed/event/${event._id}/registration/me`,
  }) as any;

  const tabItems: TabsProps['items'] = [
    {
      key: 'details',
      label: (
        <span className={styles.tabLabel}>
          <IoInformationCircleOutline size={20} />
          <span>Event Details</span>
        </span>
      ),
      children: <EventInfoTab event={event} />,
    },
    {
      key: 'attendees',
      label: (
        <span className={styles.tabLabel}>
          <IoPeopleOutline size={20} />
          <span>Attendees</span>
        </span>
      ),
      children: <EventAttendeesTab event={event} />,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.eventType}>{getEventTypeLabel(event.type)}</span>
          <span className={`${styles.status} ${getStatusColor(event.status, styles)}`}>{event.status.toUpperCase()}</span>
        </div>
        {event.sport && (
          <div className={styles.sport}>
            <MdSportsSoccer size={18} />
            <span>{event.sport}</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className={styles.titleSection}>
        <h2 className={styles.title}>{event.title}</h2>
        {event.description && <p className={styles.description}>{event.description}</p>}
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="details" items={tabItems} className={styles.tabs} />

      {/* Registration Button */}
      {event.registration?.required && isRegistrationOpen(event) && (
        <div className={styles.registrationButton}>
          <Tooltip title={hasRegistered?.payload ? "You are already registered for this event." : "Click to register for this event."}>
            <Button type="primary" size="large" onClick={() => setRegistrationModalOpen(true)} disabled={hasRegistered?.payload}>
              {hasRegistered?.payload ? hasRegistered?.payload?.status : 'Register for Event'}
            </Button>
          </Tooltip>
        </div>
      )}
      {/* Registration Modal */}
      <RegistrationModal event={event} open={registrationModalOpen} onClose={() => setRegistrationModalOpen(false)} />
    </div>
  );
};

export default EventDetailCard;
