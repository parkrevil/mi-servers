import { registerAs } from '@nestjs/config';

import { AppConfig } from './interfaces';

export default registerAs(
  'app',
  (): AppConfig => ({
    userPasswordSalt: process.env.USER_PASSWORD_SALT,
    jwt: {
      secret: process.env.JWT_SECRET,
      options: {
        audience: process.env.JWT_AUDIENCE,
        subject: process.env.JWT_SUBJECT,
        issuer: process.env.JWT_ISSUER,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    },
  }),
);
