import { IsEnum, IsOptional, IsString } from 'class-validator';

enum sort {
  asc,
  desc,
}

enum sortBy {
  likes,
  date,
}

export class FilterDto {
  @IsString()
  @IsOptional()
  userId?: string;
  @IsEnum(sort)
  @IsOptional()
  sort?: 'asc' | 'desc';
  @IsEnum(sortBy)
  @IsOptional()
  sortBy?: 'likes' | 'date';
}
