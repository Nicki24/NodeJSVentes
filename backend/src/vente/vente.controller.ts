import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { VenteService } from './vente.service';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';

@Controller('vente')
export class VenteController {
  constructor(private readonly venteService: VenteService) {}

  // POST /vente — Ajouter une vente
  @Post()
  create(@Body() dto: CreateVenteDto) {
    return this.venteService.create(dto);
  }

  // GET /vente — Afficher toutes les ventes
  @Get()
  findAll() {
    return this.venteService.findAll();
  }

  // GET /vente/stats — Statistiques globales
  @Get('stats')
  getStats() {
    return this.venteService.getStats();
  }

  // GET /vente/:id — Afficher une vente
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.venteService.findOne(id);
  }

  // PUT /vente/:id — Modifier une vente
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVenteDto) {
    return this.venteService.update(id, dto);
  }

  // DELETE /vente/:id — Supprimer une vente
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.venteService.remove(id);
  }
}
