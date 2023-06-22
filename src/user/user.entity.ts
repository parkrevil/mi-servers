import { DateTime } from 'luxon';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DateTimeTypeTransformer } from '@/core/providers/typeorm/transformers';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @CreateDateColumn({
    transformer: new DateTimeTypeTransformer(),
  })
  createdAt: DateTime;

  @UpdateDateColumn({
    transformer: new DateTimeTypeTransformer(),
  })
  updatedAt: DateTime;

  constructor(params?: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}
