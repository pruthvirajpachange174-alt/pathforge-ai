import { clerkClient } from '@clerk/clerk-sdk-node';
import { env } from '../config/env';

const adminEmails = new Set(
  env.ADMIN_EMAILS.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean),
);

export async function isAdminClerkUser(clerkId: string): Promise<boolean> {
  const user = await clerkClient.users.getUser(clerkId);
  return (user.emailAddresses ?? []).some(
    (address) =>
      address.verification?.status === 'verified' &&
      adminEmails.has(address.emailAddress.trim().toLowerCase()),
  );
}
