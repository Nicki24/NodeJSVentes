import { IsString, IsNotEmpty, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateVenteDto {
  @IsString()
  @IsNotEmpty({ message: 'Le numéro produit est obligatoire' })
  @MaxLength(50)
  @Transform(({ value }) => value?.toString()?.trim())
  numProduit: string;

  @IsString()
  @IsNotEmpty({ message: 'La désignation est obligatoire' })
  @MaxLength(100)
  @Transform(({ value }) => value?.toString()?.trim())
  design: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'Le prix doit être supérieur à 0' })
  prix: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'La quantité doit être supérieure à 0' })
  quantite: number;
}
