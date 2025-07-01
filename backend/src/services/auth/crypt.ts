import bcrypt from 'bcrypt';

export async function encrypt(text: string): Promise<string> {
  return bcrypt.hash(text, 10);
}

export async function compareHash(
  text: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(text, hash);
}
