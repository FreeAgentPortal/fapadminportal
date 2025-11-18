import { EventDocument } from '@/types/IEventType';

/**
 * Formats a date to long format with weekday
 * Example: "Monday, November 3, 2025"
 */
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a date to short format for ranges
 * Example: "Nov 3, 2025"
 */
export const formatShortDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats time in 12-hour format
 * Example: "9:00 AM"
 */
export const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Checks if an event spans multiple days
 */
export const isMultiDayEvent = (startsAt: Date, endsAt: Date) => {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  // Set both dates to midnight to compare just the dates
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return start.getTime() !== end.getTime();
};

/**
 * Returns formatted date display (single or range)
 */
export const getDateDisplay = (startsAt: Date, endsAt: Date) => {
  if (isMultiDayEvent(startsAt, endsAt)) {
    return `${formatShortDate(startsAt)} - ${formatShortDate(endsAt)}`;
  }
  return formatDate(startsAt);
};

/**
 * Returns formatted time display
 */
export const getTimeDisplay = (startsAt: Date, endsAt: Date, allDay: boolean) => {
  if (allDay) {
    return isMultiDayEvent(startsAt, endsAt) ? 'Multi-Day Event' : 'All Day';
  }
  return `${formatTime(startsAt)} - ${formatTime(endsAt)}`;
};

/**
 * Capitalizes event type
 */
export const getEventTypeLabel = (type: string) => {
  return type?.charAt(0)?.toUpperCase() + type?.slice(1);
};

/**
 * Returns CSS class for event status
 */
export const getStatusColor = (status: string, styles: any) => {
  switch (status) {
    case 'scheduled':
      return styles.statusScheduled;
    case 'active':
      return styles.statusActive;
    case 'completed':
      return styles.statusCompleted;
    case 'canceled':
      return styles.statusCanceled;
    case 'postponed':
      return styles.statusPostponed;
    default:
      return '';
  }
};

/**
 * Returns formatted location display
 */
export const getLocationDisplay = (event: EventDocument) => {
  if (event.location.kind === 'virtual') {
    return event.location.virtual?.platform || 'Virtual Event';
  }
  if (event.location.physical) {
    const parts = [event.location.physical.venueName, event.location.physical.city, event.location.physical.state].filter(Boolean);
    return parts.join(', ') || 'Physical Location';
  }
  return 'Location TBD';
};

/**
 * Checks if registration is currently open
 * Registration is open if:
 * 1. Current date is after opensAt (if defined)
 * 2. Current date is before closesAt (if defined)
 * Note: Event start time doesn't matter - registration window is independent
 */
export const isRegistrationOpen = (event: EventDocument): boolean => {
  if (!event.registration?.required) {
    return false;
  }

  const now = new Date();
  const { opensAt, closesAt } = event.registration;

  // Check if registration has opened
  if (opensAt && new Date(opensAt) > now) {
    return false; // Registration hasn't opened yet
  }

  // Check if registration has closed
  if (closesAt && new Date(closesAt) < now) {
    return false; // Registration is closed
  }

  return true;
};

/**
 * Gets the registration status message
 */
export const getRegistrationStatus = (event: EventDocument): string | null => {
  if (!event.registration?.required) {
    return null;
  }

  const now = new Date();
  const { opensAt, closesAt } = event.registration;

  // Check if registration hasn't opened yet
  if (opensAt && new Date(opensAt) > now) {
    return `Registration opens ${formatDate(opensAt)}`;
  }

  // Check if registration has closed
  if (closesAt && new Date(closesAt) < now) {
    return 'Registration closed';
  }

  // Check if event has already started
  if (event.startsAt && new Date(event.startsAt) < now) {
    return 'Event has started';
  }

  return null;
};
