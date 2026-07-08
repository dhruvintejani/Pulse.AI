export interface CurrentUser {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  initials: string;
  role?: 'owner' | 'admin' | 'member' | 'viewer';
  isAdmin?: boolean;
}
