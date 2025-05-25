import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: '%(tableName)s' })
export class %(className)s {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Columns definition here

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
