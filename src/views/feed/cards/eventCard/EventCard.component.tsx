'use client';
import React from 'react';
import Link from 'next/link';
import { EventDocument } from '@/types/IEventType';
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdSportsSoccer } from 'react-icons/md';
import {
  formatDate,
  getDateDisplay,
  getTimeDisplay,
  getEventTypeLabel,
  getStatusColor,
  getLocationDisplay,
  isMultiDayEvent,
  isRegistrationOpen,
  getRegistrationStatus,
} from './utils/eventCardHelpers';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: EventDocument;
  postId: string;
}

const EventCard = ({ event, postId }: EventCardProps) => {
  const registrationOpen = isRegistrationOpen(event);
  const registrationStatusMessage = getRegistrationStatus(event);

  return (
    <div className={styles.container}>
      {/* Event Header */}
      <div className={styles.header}>
        <div className={styles.typeAndStatus}>
          <span className={styles.eventType}>{getEventTypeLabel(event?.type)}</span>
          <span className={`${styles.status} ${getStatusColor(event?.status, styles)}`}>{event?.status?.toUpperCase()}</span>
        </div>
        {event.sport && (
          <div className={styles.sport}>
            <MdSportsSoccer size={16} />
            <span>{event.sport}</span>
          </div>
        )}
      </div>

      {/* Event Title & Description */}
      <div className={styles.eventInfo}>
        <h3 className={styles.title}>{event?.title}</h3>
        {event?.description && <p className={styles.description}>{event?.description}</p>}
      </div>

      {/* Event Details Grid */}
      <div className={styles.detailsGrid}>
        {/* Date & Time */}
        <div className={styles.detailItem}>
          <IoCalendarOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>{isMultiDayEvent(event?.startsAt, event?.endsAt) ? 'Dates' : 'Date'}</span>
            <span className={styles.detailValue}>{getDateDisplay(event?.startsAt, event?.endsAt)}</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <IoTimeOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Time</span>
            <span className={styles.detailValue}>{getTimeDisplay(event?.startsAt, event?.endsAt, event?.allDay || false)}</span>
          </div>
        </div>

        {/* Location */}
        <div className={styles.detailItem}>
          <IoLocationOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>{getLocationDisplay(event)}</span>
          </div>
        </div>

        {/* Audience */}
        <div className={styles.detailItem}>
          <IoPeopleOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Audience</span>
            <span className={styles.detailValue}>{event.audience.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Registration Info */}
      {event.registration?.required && (
        <div className={styles.registrationInfo}>
          <div className={styles.registrationHeader}>
            <span className={styles.registrationLabel}>Registration Required</span>
            {event.registration.capacity && <span className={styles.capacity}>Capacity: {event?.registration.capacity}</span>}
          </div>
          {event.registration.opensAt && event.registration.closesAt && (
            <p className={styles.registrationDates}>
              Opens: {formatDate(event?.registration.opensAt)} | Closes: {formatDate(event?.registration.closesAt)}
            </p>
          )}
          {event.registration.price && (
            <p className={styles.price}>
              Price: ${event?.registration.price} {event?.registration.currency || 'USD'}
            </p>
          )}
        </div>
      )}

      {/* Eligibility */}
      {event.eligibility && (
        <div className={styles.eligibility}>
          <span className={styles.eligibilityLabel}>Eligibility:</span>
          {event.eligibility.positions && event.eligibility.positions.length > 0 && (
            <span className={styles.eligibilityItem}>Positions: {event?.eligibility.positions.join(', ')}</span>
          )}
          {event.eligibility.ageRange && (
            <span className={styles.eligibilityItem}>
              Age: {event?.eligibility.ageRange.min || '?'} - {event?.eligibility.ageRange.max || '?'}
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className={styles.tags}>
          {event.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        {event.registration?.required ? (
          <>
            {registrationOpen ? (
              <Link href={`/feed/${postId}?action=register`} className={styles.primaryButton}>
                Register Now
              </Link>
            ) : (
              <button className={styles.primaryButton} disabled>
                {registrationStatusMessage || 'Registration Closed'}
              </button>
            )}
            <Link href={`/feed/${postId}`} className={styles.secondaryButton}>
              View Details
            </Link>
          </>
        ) : (
          <Link href={`/feed/${postId}`} className={styles.primaryButton}>
            View Details
          </Link>
        )}
        {event.location.kind === 'virtual' && event.location.virtual?.meetingUrl && (
          <a href={event?.location.virtual.meetingUrl} target="_blank" rel="noopener noreferrer" className={styles.virtualButton}>
            Join Virtual Event
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;
