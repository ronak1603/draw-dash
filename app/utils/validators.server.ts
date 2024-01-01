export const onValidUsername = (userName: string): string | undefined => {
  const usernameRegex = /^[a-z0-9_.]+$/;
  if (!usernameRegex.test(userName)) {
    return "Please enter a valid email address";
  }
};

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 5) {
    return "Please enter a password that is at least 5 characters long";
  }
};

export const validateName = (name: string): string | undefined => {
  if (!name.length) return `Please enter a value`;
};
