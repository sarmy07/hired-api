import { HashingProvider } from './hashing.provider';
import * as bcyrpt from 'bcrypt';

export class BcryptProvider extends HashingProvider {
  async hash(password: string): Promise<string> {
    return await bcyrpt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcyrpt.compare(password, hashedPassword);
  }
}
