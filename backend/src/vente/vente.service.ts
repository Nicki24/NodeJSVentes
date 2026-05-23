import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Vente } from './vente.entity';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';

@Injectable()
export class VenteService {
  constructor(
    @InjectRepository(Vente)
    private venteRepository: Repository<Vente>,
  ) {}

  // Ajouter une vente (montant calculé automatiquement)
  async create(dto: CreateVenteDto): Promise<Vente> {
    const montant = Number(dto.prix) * Number(dto.quantite);
    const vente = this.venteRepository.create({ ...dto, montant });
    try {
      return await this.venteRepository.save(vente);
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Le numéro produit "${dto.numProduit}" existe déjà`);
      }
      throw err;
    }
  }

  // Récupérer toutes les ventes
  async findAll(): Promise<Vente[]> {
    return this.venteRepository.find({ order: { created_at: 'DESC' } });
  }

  // Récupérer une vente par ID
  async findOne(id: number): Promise<Vente> {
    const vente = await this.venteRepository.findOne({ where: { id } });
    if (!vente) {
      throw new NotFoundException(`Vente #${id} introuvable`);
    }
    return vente;
  }

  // Modifier une vente (recalcul automatique du montant)
  async update(id: number, dto: UpdateVenteDto): Promise<Vente> {
    const vente = await this.findOne(id);
    const updated = { ...vente, ...dto };
    updated.montant = Number(updated.prix) * Number(updated.quantite);
    try {
      return await this.venteRepository.save(updated);
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY') {
        const value = dto.numProduit || 'inconnu';
        throw new ConflictException(`Le numéro produit "${value}" existe déjà`);
      }
      throw err;
    }
  }

  // Supprimer une vente
  async remove(id: number): Promise<{ message: string }> {
    const vente = await this.findOne(id);
    await this.venteRepository.remove(vente);
    return { message: `Vente #${id} supprimée avec succès` };
  }

  // Statistiques : total, min, max (avec désignation)
  async getStats(): Promise<{
    total: number;
    min: number;
    minDesign: string;
    max: number;
    maxDesign: string;
  }> {
    const totalResult = await this.venteRepository
      .createQueryBuilder('vente')
      .select('SUM(vente.montant)', 'total')
      .getRawOne();

    const minVente = await this.venteRepository.findOne({
      order: { montant: 'ASC' },
      select: ['montant', 'design'],
    });
    const maxVente = await this.venteRepository.findOne({
      order: { montant: 'DESC' },
      select: ['montant', 'design'],
    });

    return {
      total: Number(totalResult.total) || 0,
      min: minVente ? Number(minVente.montant) : 0,
      minDesign: minVente?.design || '',
      max: maxVente ? Number(maxVente.montant) : 0,
      maxDesign: maxVente?.design || '',
    };
  }
}
