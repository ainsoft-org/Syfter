import * as bcrypt from 'bcrypt';

export function hashData(data: string): Promise<string> {
  return bcrypt.hash(data, 10);
}

export function compareData(data: string, hash: string): Promise<boolean> {
  return bcrypt.compare(data, hash);
}