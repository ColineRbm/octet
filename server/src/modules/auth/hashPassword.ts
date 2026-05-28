import argon2 from "argon2";

const hashPassword = async () => {
  const password = "Admin1234!";
  const hash = await argon2.hash(password);
  console.info(hash);
};

hashPassword();
