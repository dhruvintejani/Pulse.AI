import type { UserResource } from '@clerk/types';
import type { CurrentUser } from '@/types/user';

const getInitials = (firstName?: string | null, lastName?: string | null, email?: string) => {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim();
  if (initials) return initials.toUpperCase();
  return email?.slice(0, 2).toUpperCase() || 'AI';
};

export const mapClerkUser = (user: UserResource): CurrentUser => {
  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = user.fullName || [firstName, lastName].filter(Boolean).join(' ') || email || 'Alex Morgan';

  return {
    id: user.id,
    fullName,
    firstName,
    lastName,
    email,
    imageUrl: user.imageUrl,
    initials: getInitials(firstName, lastName, email),
  };
};
