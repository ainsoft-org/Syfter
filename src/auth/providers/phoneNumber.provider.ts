import * as libphonenumber from 'libphonenumber-js';

export function isCorrectPhone(phoneNumber: string): boolean {
  return libphonenumber.isValidPhoneNumber(phoneNumber);
}

export function parsePhone(phoneNumber: string): libphonenumber.PhoneNumber {
  return libphonenumber.parsePhoneNumber(phoneNumber);
}