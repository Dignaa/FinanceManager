import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateEntryDto {
    
       @IsNotEmpty()
          title: string
      
          @IsNotEmpty()
          amount: number
      
          @IsNotEmpty()
          currency: string
      
          @IsNotEmpty()
          date: Date
      
          @IsOptional()
          picture: string

            @IsNotEmpty()
          categoryId: string
    }
