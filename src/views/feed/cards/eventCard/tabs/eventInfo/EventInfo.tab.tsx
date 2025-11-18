'use client';
import React from 'react';
import { EventDocument } from '@/types/IEventType';
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline, IoPeopleOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { MdPeople } from 'react-icons/md';
import { BiDollar } from 'react-icons/bi';
import { formatDate, getDateDisplay, getTimeDisplay, getLocationDisplay, isMultiDayEvent } from '../../utils/eventCardHelpers';
import styles from './EventInfo.module.scss';

interface EventInfoTabProps {
  event: EventDocument;
}

const EventInfoTab = ({ event }: EventInfoTabProps) => {
  return (
    <div className={styles.container}>
      {/* Main Details Section */}
      <div className={styles.detailsSection}>

        <div className={styles.detailsGrid}>
          {/* Date */}
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}>
              <IoCalendarOutline size={24} />
            </div>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>{isMultiDayEvent(event.startsAt, event.endsAt) ? 'Dates' : 'Date'}</span>
              <span className={styles.detailValue}>{getDateDisplay(event.startsAt, event.endsAt)}</span>
            </div>
          </div>

          {/* Time */}
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}>
              <IoTimeOutline size={24} />
            </div>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Time</span>
              <span className={styles.detailValue}>{getTimeDisplay(event.startsAt, event.endsAt, event.allDay || false)}</span>
              {event.timezone && <span className={styles.timezone}>{event.timezone}</span>}
            </div>
          </div>

          {/* Location */}
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}>
              <IoLocationOutline size={24} />
            </div>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Location</span>
              <span className={styles.detailValue}>{getLocationDisplay(event)}</span>

              {/* Physical Address Details */}
              {event.location.kind === 'physical' && event.location.physical && (
                <div className={styles.addressDetails}>
                  {event.location.physical.venueName && <p>{event.location.physical.venueName}</p>}
                  {event.location.physical.addressLine1 && <p>{event.location.physical.addressLine1}</p>}
                  {event.location.physical.addressLine2 && <p>{event.location.physical.addressLine2}</p>}
                  {(event.location.physical.city || event.location.physical.state || event.location.physical.postalCode) && (
                    <p>
                      {event.location.physical.city}
                      {event.location.physical.state && `, ${event.location.physical.state}`}
                      {event.location.physical.postalCode && ` ${event.location.physical.postalCode}`}
                    </p>
                  )}
                  {event.location.physical.country && <p>{event.location.physical.country}</p>}
                </div>
              )}

              {/* Virtual Meeting Link */}
              {event.location.kind === 'virtual' && event.location.virtual?.meetingUrl && (
                <a href={event.location.virtual.meetingUrl} target="_blank" rel="noopener noreferrer" className={styles.meetingLink}>
                  Join Virtual Event
                </a>
              )}
            </div>
          </div>

          {/* Audience */}
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}>
              <IoPeopleOutline size={24} />
            </div>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Audience</span>
              <span className={styles.detailValue}>{event.audience.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Section */}
      {event.registration?.required && (
        <div className={styles.registrationSection}>
          <h3 className={styles.sectionTitle}>Registration Information</h3>

          <div className={styles.registrationDetails}>
            {event.registration.capacity && (
              <div className={styles.registrationRow}>
                <MdPeople size={20} />
                <span>Capacity: {event.registration.capacity} participants</span>
              </div>
            )}

            {event.registration.price && (
              <div className={styles.registrationRow}>
                <BiDollar size={20} />
                <span>
                  ${event.registration.price} {event.registration.currency || 'USD'}
                </span>
              </div>
            )}

            {event.registration.opensAt && event.registration.closesAt && (
              <div className={styles.registrationDates}>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>Opens:</span>
                  <span>{formatDate(event.registration.opensAt)}</span>
                </div>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>Closes:</span>
                  <span>{formatDate(event.registration.closesAt)}</span>
                </div>
              </div>
            )}

            {event.registration.waitlistEnabled && (
              <div className={styles.infoNote}>
                <IoInformationCircleOutline size={18} />
                <span>Waitlist available if event is full</span>
              </div>
            )}

            {event.registration.allowWalkIns && (
              <div className={styles.infoNote}>
                <IoInformationCircleOutline size={18} />
                <span>Walk-ins accepted</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Eligibility Section */}
      {event.eligibility && (
        <div className={styles.eligibilitySection}>
          <h3 className={styles.sectionTitle}>Eligibility Requirements</h3>

          <div className={styles.eligibilityDetails}>
            {event.eligibility.positions && event.eligibility.positions.length > 0 && (
              <div className={styles.eligibilityItem}>
                <span className={styles.eligibilityLabel}>Positions:</span>
                <span className={styles.eligibilityValue}>{event.eligibility.positions.join(', ')}</span>
              </div>
            )}

            {event.eligibility.ageRange && (
              <div className={styles.eligibilityItem}>
                <span className={styles.eligibilityLabel}>Age Range:</span>
                <span className={styles.eligibilityValue}>
                  {event.eligibility.ageRange.min || '?'} - {event.eligibility.ageRange.max || '?'} years
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Opponents Section */}
      {event.opponents && event.opponents.length > 0 && (
        <div className={styles.opponentsSection}>
          <h3 className={styles.sectionTitle}>Opponents</h3>
          <div className={styles.opponentsList}>
            {event.opponents.map((opponent, index) => (
              <div key={index} className={styles.opponentItem}>
                <span className={styles.opponentName}>{opponent.name || 'TBD'}</span>
                {opponent.level && <span className={styles.opponentLevel}>{opponent.level}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags Section */}
      {event.tags && event.tags.length > 0 && (
        <div className={styles.tagsSection}>
          <div className={styles.tagsList}>
            {event.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInfoTab;
