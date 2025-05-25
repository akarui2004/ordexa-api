import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Principal } from './Principal'

@Entity({ name: 'credentials' })
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Principal, { nullable: false, onDelete: 'CASCADE' })
  principal: Principal

  @Column('uuid', { nullable: false })
  principalId: string

  @Column('varchar', { nullable: false, length: 64 })
  accessKey: string

  @Column('varchar', { nullable: false })
  secretKey: string

  @Column('varchar', { nullable: false, default: 'password' })
  type: 'password' | 'totp' | 'key'

  @Column('timestamp', { nullable: true })
  verifiedAt?: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
