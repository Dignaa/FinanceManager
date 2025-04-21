import { Category } from "../../categories/entities/category.entity"
import { Entity, PrimaryGeneratedColumn, Column, Double, ManyToOne } from "typeorm"

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    amount: number

    @Column()
    currency: string

    @Column()
    date: Date

    @Column()
    picture: string

    @ManyToOne(() => Category, (category) => category.entries)
    category: Category
}