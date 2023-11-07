import { IsNumber } from 'class-validator';
class RatingDTO {
  @IsNumber()
  rating: number;

  @IsNumber()
  quality: number;
}

export default RatingDTO;
