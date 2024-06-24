import crypto from 'crypto';


export function generateOtp() {
  return crypto.randomInt(1000, 9999).toString();
}

export function generateResetToken ()  {
  return crypto.randomBytes(20).toString('hex');
};