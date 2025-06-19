import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users') // Nombre de la tabla
export class CreateAccount {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string

    @Column({ type: 'varchar', length: 100, nullable: true })
    password_hash: string

    @Column({ type: 'varchar', length: 100, nullable: true })
    name: string

    @Column({ type: 'boolean', default: false })
    is_verified: boolean

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date

    // Campos temporales para el proceso de verificación
    @Column({ type: 'varchar', nullable: true })
    verification_token: string | null;

    @Column({ type: 'timestamp', nullable: true })
    token_expiration: Date | null;
}