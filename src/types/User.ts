export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  customerId: string;
  profileImageUrl: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
  fullName: string;
  isActive: boolean;
  resetPasswordToken: string | undefined | null;
  resetPasswordExpire: Date | undefined | null;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  token?: string;
  lastSignedIn: Date | undefined | null;
  needsBillingSetup: boolean;
  permissions: string[];
  emailVerificationToken: string | undefined | null;
  emailVerificationExpires: Date | undefined | null;
  profileRefs: Record<string, string | null>;
}
