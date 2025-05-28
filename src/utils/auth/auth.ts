function confirmPassword(password: string, confirm_password: string) {
  if (password === confirm_password) {
    return true;
  }
  return false;
}

export { confirmPassword };
