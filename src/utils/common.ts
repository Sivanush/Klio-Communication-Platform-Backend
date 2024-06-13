import crypto from 'crypto';


function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }