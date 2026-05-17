import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vente } from './vente.entity';
import { VenteService } from './vente.service';
import { VenteController } from './vente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vente])],
  controllers: [VenteController],
  providers: [VenteService],
})
export class VenteModule {}
