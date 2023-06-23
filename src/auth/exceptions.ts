import { ForbiddenException } from '@nestjs/common';

export class InvalidAccountException extends ForbiddenException {}
