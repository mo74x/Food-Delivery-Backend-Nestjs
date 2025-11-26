import { IsNotEmpty, IsString, IsNumber ,IsUUID} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({example: 'Pizza Margherita',description: 'Product name'})
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiProperty({example: 'Classic pizza with tomato and mozzarella',description: 'Product description'})
    @IsString()
    description:string;

    @ApiProperty({example: 12.99,description: 'Product price'})
    @IsNumber()
    price:number;

    @ApiProperty({example: 'uuid-here',description: 'Restaurant ID'})
    @IsUUID()
    restaurantId:string;
}
