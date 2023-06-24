import { ForbiddenException } from '@nestjs/common';

export class RefreshTokenExpiredException {}
export class UserNotFoundException {}
export class InvalidPasswordException {}
export class InvalidAccountException extends ForbiddenException {}
