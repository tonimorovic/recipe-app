import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/User.js';
import { Recipe } from '../recipe/Recipe.js';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column({ type: 'date', name: 'purchase_date' })
  purchaseDate: Date;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'varchar', name: 'payment_method' })
  paymentMethod: string;

  @Column({ type: 'varchar', name: 'transaction_id' })
  transactionId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
