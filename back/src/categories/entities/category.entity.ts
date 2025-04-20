import { Entry } from "src/entries/entities/entry.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ nullable: true })
    description: string

    @OneToMany(() => Entry, (entry) => entry.category)
    entries: Entry[]

}