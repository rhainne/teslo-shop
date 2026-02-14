import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @ApiProperty({
    description: 'The number of items to return',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'The number of items to skip before starting to collect the result set',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
};