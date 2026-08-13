import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly userService: UsersService,
  ) {}
  async create(dto: CreateCategoryDto, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException();

    dto.name = dto.name.trim().toLowerCase();

    const duplicate = await this.categoryRepo.findOne({
      where: {
        name: dto.name,
      },
    });

    if (duplicate) {
      throw new ConflictException('You have already created this category');
    }

    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({
      where: {
        id,
      },
      relations: {
        jobs: true,
      },
    });

    if (!category) throw new NotFoundException();
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string) {
    const category = await this.findOne(id);

    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException();

    if (dto.name) {
      dto.name = dto.name.trim().toLowerCase();

      const duplicate = await this.categoryRepo.findOne({
        where: {
          name: dto.name,
        },
      });

      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('category already exists');
      }
    }

    Object.assign(category, dto);

    return await this.categoryRepo.save(category);
  }

  async remove(id: string, userId: string) {
    const category = await this.findOne(id);

    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException();

    if (category.jobs.length > 0) {
      throw new ConflictException(
        'cannot delete category that is assigned to jobs',
      );
    }

    await this.categoryRepo.remove(category);
    return {
      message: 'category removed',
    };
  }
}
