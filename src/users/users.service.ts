import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
