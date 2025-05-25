import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne } from "typeorm"
import { Organization } from './Organization'

@Entity({ name: 'principals' })
export class Principal {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Organization, { nullable: false, onDelete: 'CASCADE' })
  organization: Organization

  @Column('uuid', { nullable: false })
  organizationId: string

  @Column('uuid', { nullable: false })
  ownerId: string

  @Column('varchar', { nullable: false })
  ownerType: 'user' | 'account'

  @Column('varchar', { nullable: true, default: 'active' })
  status: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
