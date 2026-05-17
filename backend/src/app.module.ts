import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenteModule } from './vente/vente.module';
import { Vente } from './vente/vente.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'gestion_vente',
      entities: [Vente],
      synchronize: true, // Crée/met à jour la table automatiquement
    }),
    VenteModule,
  ],
})
export class AppModule {}
