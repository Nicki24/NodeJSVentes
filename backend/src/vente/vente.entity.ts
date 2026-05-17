import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('vente')
export class Vente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  numProduit: string;

  @Column({ length: 100 })
  design: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column('int')
  quantite: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @CreateDateColumn()
  created_at: Date;
}
