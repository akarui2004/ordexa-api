import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { nullable: false })
  name: string

  @Column('varchar', { default: 'active', nullable: true })
  status: string

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
