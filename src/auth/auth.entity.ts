import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { DateTimeTypeTransformer } from '@/core/providers/typeorm/transformers';

@Entity({
  name: 'auth',
})
@Unique(['refreshToken'])
export class Auth {
  @PrimaryColumn({
    unsigned: true,
    comment: '사용자 PK',
  })
  userId: number;

  @PrimaryColumn({
    unsigned: true,
    comment: '기기 PK',
  })
  deviceId: number;

  @Column({
    type: 'char',
    length: 64,
    comment: 'Refresh Token',
  })
  refreshToken: string;

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

  constructor(params?: Omit<Auth, 'createdAt' | 'updatedAt'>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}
