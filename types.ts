
export enum UserRole {
  USER = 'user',
  TREASURY = 'treasury'
}

export enum TransferStatus {
  NOT_REACHED = 'لم يتم الوصول',
  REACHED = 'تم الوصول'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  fullName: string;
}

export interface Transfer {
  id: string;
  customerName: string;
  bankAccount: string;
  amount: number;
  createdAt: string; // ISO String
  createdBy: string; // User ID
  creatorName: string;
  status: TransferStatus;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
}
