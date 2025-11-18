'use client';
import React from 'react';
import { EventDocument } from '@/types/IEventType';
import { IoPeopleOutline } from 'react-icons/io5';
import styles from './EventAttendees.module.scss';

interface EventAttendeesTabProps {
  event: EventDocument;
}

const EventAttendeesTab = ({ event }: EventAttendeesTabProps) => {
  // TODO: Fetch attendees data from API
  // TODO: Implement useAttendees hook for approved, pending, waitlist data
  // TODO: Create AttendeeList component to display attendee avatars/names
  // TODO: Add filtering/search functionality

  return (
    <div className={styles.attendeesSection}>
      <div className={styles.attendeesPlaceholder}>
        <IoPeopleOutline size={48} />
        <h4>Attendee Management Coming Soon</h4>
        <p>View approved attendees, pending requests, and waitlist</p>
      </div>
    </div>
  );
};

export default EventAttendeesTab;
