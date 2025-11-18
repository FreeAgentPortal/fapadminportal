export const RegistrationStatus = {
  INTERESTED: 'interested', // light-weight “I’m watching this”
  APPLIED: 'applied', // submitted registration answers
  INVITED: 'invited', // invited by team
  CONFIRMED: 'confirmed', // has a spot
  WAITLISTED: 'waitlisted',
  DECLINED: 'declined',
  NO_SHOW: 'no-show',
  ATTENDED: 'attended',
} as const;
export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export interface IEventRegistration {
  _id: string;
  eventId: string;
  userId: string; // who is acting (athlete/agent/scout)
  athleteProfileId?: string; // if applicable
  role: 'athlete' | 'agent' | 'scout' | 'media';

  status: RegistrationStatus;

  // answers keyed by Event.registration.questions[].key
  answers?: Record<string, string | number | boolean | string[]>;

  // server-side stamps
  createdAt: Date;
  updatedAt: Date;
}
