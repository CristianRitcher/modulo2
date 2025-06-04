import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-something.neon.tech',
      port: 5432,
      username: 'autorizacion_owner',
      password: 'npg_4HrLq1CwIBdf',
      database: 'autorizacion',
      ssl: { rejectUnauthorized: false }, // Neon requiere SSL
      autoLoadEntities: true,
      synchronize: true, // cambiar a false en producción
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
