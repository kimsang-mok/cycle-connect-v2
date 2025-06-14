export enum VerificationStatus {
  pending = 'pending',
  verified = 'verified',
}

export interface UserVerificationProps {
  userId: string;
  status: VerificationStatus;
  verifiedAt?: Date;
}

export interface CreateUserVerificationProps {
  userId: string;
  token: string;
}

export interface SessionProps {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export type CreateSessionProps = SessionProps;
