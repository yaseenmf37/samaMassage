export function validateName(name) {
  return name.trim().length >= 3;
}

export function validatePhone(phone) {
  return /^09\d{9}$/.test(phone);
}

export function validateNationalId(nid) {
  return /^\d{10}$/.test(nid);
}
