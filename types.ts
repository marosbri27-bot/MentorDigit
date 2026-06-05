/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'docente' | 'estudiante' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredUnderTeacherId?: string; // Multi-tenant link
  dateJoined: string;
}

export interface Material {
  id: string;
  teacherId: string;
  title: string;
  content: string; // The textual data of the document or material
  type: 'pdf_text' | 'video_link' | 'text_note';
  sourceUrl?: string;
  dateAdded: string;
}

export interface Activity {
  id: string;
  teacherId: string;
  title: string;
  instructions: string;
  suggestedMaterialIds: string[]; // Linked materials
  durationMinutes: number; // For the pedagogical timer
  points: number; // For RPG level scaling
  invitationCode: string; // Unique sharing token
  createdDate: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  studentName: string;
  activityId: string;
  activityTitle: string;
  teacherId: string;
  score: number; // 0-100% score
  timeSpentSeconds: number;
  completedAt: string;
  feedback: string;
  status: 'pending' | 'reviewing' | 'completed';
}

export interface RPGStats {
  studentId: string;
  level: number; // e.g: 1 to 10
  currentXp: number; // 0 to 100
  totalCompletedTimeSeconds: number;
  totalActivitiesCompleted: number;
}

export interface BillingConfig {
  teacherId: string;
  walletType: 'Nequi' | 'Daviplata' | 'Pago Movil' | 'Alias / Otro';
  walletDetail: string; // Phone number or transfer ID
  weeklyPrice: number;
  monthlyPrice: number;
  isConfigured: boolean;
}

export interface StudentSubscription {
  studentId: string;
  teacherId: string;
  status: 'active' | 'expired' | 'pending';
  expiresAt: string; // Date string
  lastPaymentAmount: number;
}

export interface GlobalMessage {
  id: string;
  senderName: string; // "Koby"
  title: string;
  body: string;
  sentAt: string;
}

// Global traffic and metric aggregation for Admin panel
export interface AdminMetrics {
  totalRequests: number;
  totalRegisteredStudents: number;
  totalRegisteredTeachers: number;
  totalProcessedPayments: number;
}

export interface FullAppState {
  users: UserProfile[];
  materials: Material[];
  activities: Activity[];
  progress: StudentProgress[];
  rpg: RPGStats[];
  billing: BillingConfig[];
  subscriptions: StudentSubscription[];
  broadcasts: GlobalMessage[];
  metrics: AdminMetrics;
}
