import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateVenteDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.toString()?.trim())
  numProduit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.toString()?.trim())
  design?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'Le prix doit être supérieur à 0' })
  prix?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'La quantité doit être supérieure à 0' })
  quantite?: number;
}
