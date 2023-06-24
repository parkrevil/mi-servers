import { Env } from './enums';

export const isLocal = () => process.env.NODE_ENV === Env.Local;
export const isProduction = () => process.env.NODE_ENV === Env.Production;
export const toApiExceptions = (...exceptions: any[]) =>
  exceptions.map((e) => e.name.replace('Exception', '')).join(',');
export const cryptoRandomString = async (options: any) => {
  const module = await (eval(`import('crypto-random-string')`) as Promise<any>);

  return module.cryptoRandomStringAsync(options);
};
