import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne } from "typeorm"
import { Organization } from './Organization'

@Entity({ name: 'principals' })
export class Principal {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Organization, { nullable: false, onDelete: 'CASCADE' })
  organization: Organization

  @Column('uuid', { name: 'organizationId', nullable: false })
  organizationId: string

  @Column('uuid', { name: 'ownerId', nullable: false })
  ownerId: string

  @Column('varchar', { name: 'ownerType', nullable: false })
  ownerType: string

  @Column('varchar', { nullable: true, default: 'active' })
  status: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
