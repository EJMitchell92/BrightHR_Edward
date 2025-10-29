import * as dotenv from "dotenv";

dotenv.config();

const adminUsername = process.env.ADMIN_EMAIL as string;
const adminPassword = process.env.ADMIN_PASSWORD as string;

if (!adminUsername) {
  throw new Error("Did not provide ADMIN_EMAIL enviroment variable");
}

if (!adminPassword) {
  throw new Error("Did not provide ADMIN_PASSWORD enviroment variable");
}

export const ENV = { adminUsername, adminPassword };
