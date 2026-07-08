import type { CurrentUser } from '@/types/user';

interface ClerkUserLike {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  imageUrl: string;
  primaryEmailAddress?: {
    emailAddress?: string;
  } | null;
  publicMetadata?: Record<string, unknown>;
}

const getInitials = (firstName?: string | null, lastName?: string | null, email?: string) => {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim();
  if (initials) return initials.toUpperCase();
  return email?.slice(0, 2).toUpperCase() || 'AI';
};

const getConfiguredAdminEmails = () => (
  import.meta.env.VITE_ADMIN_EMAILS?.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean) ?? []
);

const resolveRole = (user: ClerkUserLike, email: string): CurrentUser['role'] => {
  const metadataRole = user.publicMetadata?.role;
  const role = typeof metadataRole === 'string' ? metadataRole.toLowerCase() : '';
  if (role === 'owner' || role === 'admin' || role === 'member' || role === 'viewer') return role;
  if (getConfiguredAdminEmails().includes(email.toLowerCase())) return 'owner';
  return 'member';
};

export const mapClerkUser = (user: ClerkUserLike): CurrentUser => {
  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = user.fullName || [firstName, lastName].filter(Boolean).join(' ') || email || 'Alex Morgan';
  const role = resolveRole(user, email);

  return {
    id: user.id,
    fullName,
    firstName,
    lastName,
    email,
    imageUrl: user.imageUrl,
    initials: getInitials(firstName, lastName, email),
    role,
    isAdmin: role === 'owner' || role === 'admin',
  };
};
