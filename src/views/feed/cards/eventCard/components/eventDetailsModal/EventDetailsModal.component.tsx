'use client';
import React from 'react';
import { Modal } from 'antd';
import { EventDocument } from '@/types/IEventType';
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline, IoPeopleOutline, IoCloseOutline } from 'react-icons/io5';
import { MdSportsSoccer } from 'react-icons/md';
import { formatDate, getDateDisplay, getTimeDisplay, getEventTypeLabel, getStatusColor, getLocationDisplay, isMultiDayEvent } from '../../utils/eventCardHelpers';
import styles from './EventDetailsModal.module.scss';

interface EventDetailsModalProps {
  event: EventDocument;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal = ({ event, isOpen, onClose }: EventDetailsModalProps) => {
  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} width={700} closeIcon={<IoCloseOutline size={24} />} className="event-details-modal">
      <div className={styles.container}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.typeAndStatus}>
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

        {/* Event Title & Description */}
        <div className={styles.eventInfo}>
          <h2 className={styles.title}>{event.title}</h2>
          {event.description && <p className={styles.description}>{event.description}</p>}
        </div>

        {/* Event Details Grid */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Event Details</h3>
          <div className={styles.detailsGrid}>
            {/* Date & Time */}
            <div className={styles.detailItem}>
              <IoCalendarOutline size={22} className={styles.icon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>{isMultiDayEvent(event.startsAt, event.endsAt) ? 'Dates' : 'Date'}</span>
                <span className={styles.detailValue}>{getDateDisplay(event.startsAt, event.endsAt)}</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <IoTimeOutline size={22} className={styles.icon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Time</span>
                <span className={styles.detailValue}>{getTimeDisplay(event.startsAt, event.endsAt, event.allDay || false)}</span>
              </div>
            </div>

            {/* Location */}
            <div className={styles.detailItem}>
              <IoLocationOutline size={22} className={styles.icon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{getLocationDisplay(event)}</span>
                {event.location.kind === 'physical' && event.location.physical && (
                  <span className={styles.address}>
                    {event.location.physical.addressLine1 && (
                      <>
                        {event.location.physical.addressLine1}
                        <br />
                      </>
                    )}
                    {event.location.physical.addressLine2 && (
                      <>
                        {event.location.physical.addressLine2}
                        <br />
                      </>
                    )}
                    {event.location.physical.city && event.location.physical.state && `${event.location.physical.city}, ${event.location.physical.state} `}
                    {event.location.physical.postalCode && event.location.physical.postalCode}
                  </span>
                )}
                {event.location.kind === 'virtual' && event.location.virtual?.meetingUrl && (
                  <a href={event.location.virtual.meetingUrl} target="_blank" rel="noopener noreferrer" className={styles.virtualLink}>
                    Join Virtual Event →
                  </a>
                )}
              </div>
            </div>

            {/* Audience */}
            <div className={styles.detailItem}>
              <IoPeopleOutline size={22} className={styles.icon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Audience</span>
                <span className={styles.detailValue}>{event.audience.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Info */}
        {event.registration?.required && (
          <div className={styles.registrationSection}>
            <h3 className={styles.sectionTitle}>Registration Information</h3>
            <div className={styles.registrationContent}>
              <div className={styles.registrationGrid}>
                {event.registration.capacity && (
                  <div className={styles.registrationItem}>
                    <span className={styles.registrationLabel}>Capacity</span>
                    <span className={styles.registrationValue}>{event.registration.capacity} participants</span>
                  </div>
                )}
                {event.registration.opensAt && (
                  <div className={styles.registrationItem}>
                    <span className={styles.registrationLabel}>Opens</span>
                    <span className={styles.registrationValue}>{formatDate(event.registration.opensAt)}</span>
                  </div>
                )}
                {event.registration.closesAt && (
                  <div className={styles.registrationItem}>
                    <span className={styles.registrationLabel}>Closes</span>
                    <span className={styles.registrationValue}>{formatDate(event.registration.closesAt)}</span>
                  </div>
                )}
                {event.registration.price !== undefined && (
                  <div className={styles.registrationItem}>
                    <span className={styles.registrationLabel}>Price</span>
                    <span className={styles.registrationValue}>
                      {event.registration.price === 0 ? 'Free' : `$${event.registration.price} ${event.registration.currency || 'USD'}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Eligibility */}
        {event.eligibility && (event.eligibility.positions?.length || event.eligibility.ageRange) && (
          <div className={styles.eligibilitySection}>
            <h3 className={styles.sectionTitle}>Eligibility Requirements</h3>
            <div className={styles.eligibilityContent}>
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
                    {event.eligibility.ageRange.min || '?'} - {event.eligibility.ageRange.max || '?'} years old
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <div className={styles.tags}>
              {event.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          {event.registration?.required && <button className={styles.primaryButton}>Register Now</button>}
          {event.location.kind === 'virtual' && event.location.virtual?.meetingUrl && (
            <a href={event.location.virtual.meetingUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
              Join Virtual Event
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailsModal;
