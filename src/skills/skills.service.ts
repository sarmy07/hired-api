import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
  ) {}

  async create(dto: CreateSkillDto) {
    dto.name = dto.name.trim().toLowerCase();
    const existingSkill = await this.skillRepo.findOne({
      where: {
        name: dto.name,
      },
    });

    if (existingSkill) throw new ConflictException();
    const skill = this.skillRepo.create(dto);

    return await this.skillRepo.save(skill);
  }

  async findAll() {
    return await this.skillRepo.find();
  }

  async findByIds(ids: string[]) {
    return await this.skillRepo.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findOne(id: string) {
    return await this.skillRepo.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, dto: UpdateSkillDto) {
    const skill = await this.skillRepo.findOne({
      where: {
        id,
      },
    });
    if (!skill) throw new NotFoundException('skill not found');

    Object.assign(skill, dto);
    return this.skillRepo.save(skill);
  }

  async remove(id: string) {
    const skill = await this.skillRepo.findOne({
      where: {
        id,
      },
    });
    if (!skill) throw new NotFoundException('skill not found');
    return this.skillRepo.delete(skill);
  }
}
