import {
  Body,
  Controller,
  Head,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { toApiExceptions } from '@/core/helpers';

import { CreateUserDto, HasUsernameQuery } from './dtos';
import { UsernameAlreadyExistsException } from './exceptions';
import { UserService } from './user.service';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Head()
  @ApiOperation({ summary: '사용자 아이디 존재여부 확인' })
  @ApiOkResponse({
    description: '있음',
  })
  @ApiNotFoundResponse({
    description: '없음',
  })
  async hasUsername(@Query() query: HasUsernameQuery): Promise<void> {
    if (!(await this.userService.hasUsername(query.username))) {
      throw new NotFoundException();
    }
  }

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiCreatedResponse({
    description: '생성됨',
  })
  @ApiBadRequestResponse({
    description: toApiExceptions(UsernameAlreadyExistsException),
  })
  async create(@Body() body: CreateUserDto): Promise<void> {
    if (await this.userService.hasUsername(body.username)) {
      throw new UsernameAlreadyExistsException();
    }

    await this.userService.create(body);
  }
}
