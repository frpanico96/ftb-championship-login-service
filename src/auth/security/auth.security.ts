import * as bcrypt from 'bcrypt';

const SALT_OR_ROUNDS = 10;

export const encrypt = async (pass: string): Promise<string> => {
  return await bcrypt.hash(pass, SALT_OR_ROUNDS);
};

export const verifyPass = async (
  pass: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(pass, hash);
};
