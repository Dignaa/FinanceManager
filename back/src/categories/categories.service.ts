import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
   ) {
    const CategoryData =
       this.categoryRepository.create(
        createCategoryDto,
      );

    return this.categoryRepository.save(CategoryData);
  }

  async findAll(): Promise<Category[]> {
    console.log(await this.categoryRepository.find())
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const CategoryData =
      await this.categoryRepository.findOneBy({ id });
    if (!CategoryData) {
      throw new HttpException(
        'Category Not Found',
        404,
      );
    }
    return CategoryData;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.findOne(id);
    const CategoryData = this.categoryRepository.merge(
      existingCategory,
      updateCategoryDto,
    );
    return await this.categoryRepository.save(
      CategoryData,
    );
  }

  async remove(id: number): Promise<Category> {
    const existingCategory = await this.findOne(id);
    return await this.categoryRepository.remove(
      existingCategory,
    );
  }
}