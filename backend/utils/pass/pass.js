import bcrypt from "bcryptjs";

export const hashPassword = async (pass) => {
  const hashedPassword = await bcrypt.hash(pass, 10);
  return hashedPassword;
};

export const comparePassword = async (pass, userPass) => {
  const verifyPassword = await bcrypt.compare(pass, userPass);
  return verifyPassword;
};
