type Account = {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
};

export function isAllowedOwner(
  user: Account | null | undefined,
  ownerId: string | undefined,
  ownerEmail: string | undefined,
) {
  return Boolean(
    ownerId?.trim() &&
    ownerEmail?.trim() &&
    user?.email_confirmed_at &&
    user.id === ownerId.trim() &&
    user.email?.toLowerCase() === ownerEmail.trim().toLowerCase(),
  );
}
