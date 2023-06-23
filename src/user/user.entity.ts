import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { DateTimeTypeTransformer } from '@/core/providers/typeorm/transformers';

@Entity({
  name: 'user',
})
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn({
    unsigned: true,
    comment: 'PK',
  })
  id: number;

  @Column({
    length: 512,
    comment: '아이디(이메일)',
  })
  username: string;

  @Column({
    length: 1024,
    comment: '비밀번호',
  })
  password: string;

  @Column({
    length: 64,
    comment: '닉네임',
  })
  nickname: string;

  @CreateDateColumn({
    comment: '생성일시',
    transformer: new DateTimeTypeTransformer(),
  })
  createdAt: DateTime;

  @UpdateDateColumn({
    comment: '수정일시',
    transformer: new DateTimeTypeTransformer(),
  })
  updatedAt: DateTime;

  constructor(params?: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}
