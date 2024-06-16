import crypto from 'crypto';


export function generateOtp() {
    return crypto.randomInt(1000, 9999).toString();
  }