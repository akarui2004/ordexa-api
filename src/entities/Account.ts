import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { nullable: false })
  firstName: string

  @Column('varchar')
  lastName?: string

  @Column('varchar', { nullable: false })
  email: string

  @Column('timestamp')
  emailVerifiedAt?: Date

  @Column('varchar', { nullable: false })
  mobile: string

  @Column('timestamp')
  mobileVerifiedAt?: Date

  @Column('timestamp')
  birthDate?: Date

  @Column('text')
  bio?: string

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
