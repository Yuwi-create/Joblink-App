export type UserRole = 'worker' | 'employer';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  location?: string;
  avatarUrl?: string;
  rating?: number;
  reviewsCount?: number;
  skills?: string[];
}

export interface Job {
  id: number;
  title: string;
  category: string;
  description: string;
  pay: number;
  payType: 'fixed' | 'per_day' | 'per_trip';
  location: string;
  distanceKm?: number;
  date: string;
  startTime: string;
  endTime?: string;
  isUrgent: boolean;
  employer: {
    id: number;
    name: string;
    rating: number;
    reviewsCount: number;
  };
  requirements?: string[];
  postedAt: string;
}

export interface Application {
  id: number;
  job: Pick<Job, 'id' | 'title' | 'category' | 'pay'>;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export interface Conversation {
  id: number;
  participant: { id: number; name: string; online: boolean };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
