import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { DateTimeTypeTransformer } from '@/core/providers/typeorm/transformers';
import { User } from '@/user/user.entity';

@Entity({
  name: 'device',
})
export class Device {
  @PrimaryGeneratedColumn({
    unsigned: true,
    comment: 'PK',
  })
  id: number;

  @Column({
    unsigned: true,
    comment: '사용자 PK',
  })
  userId: number;

  @Column({
    length: 32,
    comment: '이름',
  })
  name: string;

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
