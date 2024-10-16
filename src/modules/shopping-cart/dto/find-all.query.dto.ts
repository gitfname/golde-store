
import { IsInt, IsOptional, Max, Min } from "class-validator"

export class FindAllQueryDto {
    @IsOptional()
    @IsInt()
    @Max(999_999)
    @Min(1)
    userId?: number;
}