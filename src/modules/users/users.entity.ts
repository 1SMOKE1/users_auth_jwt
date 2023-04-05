import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar'})
  email: string;

  @Column({type: 'varchar'})
  password: string;

  @Column({type: 'varchar', nullable: true})
  name: string;

  @Column({type: 'varchar', nullable: true})
  access_token?: string

}
