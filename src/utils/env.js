// import dotenv from 'dotenv';

// dotenv.config();

// export function env(name, defaultValue) {
//   const value = process.env[name];

//   if (value) return value;

//   if (defaultValue) return defaultValue;

//   throw new Error(`Missing: process.env['${name}'].`);
// }

import dotenv from 'dotenv';

dotenv.config();

export const env = (envName, defaultValue) => {
  if (process.env[envName]) return process.env[envName];
  if (defaultValue) return defaultValue;
  console.log(envName);
  throw new Error(`Env var with name ${envName} is not found`);
};
