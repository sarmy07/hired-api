import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/common/enums/user.role.enum';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly userService: UsersService,
  ) {}

  async create(dto: CreateCompanyDto, userId: string) {
    const owner = await this.userService.findOne(userId);

    if (!owner) {
      throw new NotFoundException('user not found');
    }

    if (owner?.role !== Role.EMPLOYER) {
      throw new ForbiddenException('Only employers can create companies');
    }

    const isCompanyNameTaken = await this.companyRepo.findOne({
      where: {
        name: dto.name,
      },
    });

    if (isCompanyNameTaken)
      throw new ConflictException('company name already exists');

    const company = this.companyRepo.create({
      ...dto,
      owner,
    });

    return await this.companyRepo.save(company);
  }

  async findAll(userId: string) {
    return await this.companyRepo.find({
      where: {
        owner: {
          id: userId,
        },
      },
    });
  }

  async findAllForAdmin() {
    return await this.companyRepo.find({
      relations: {
        owner: true,
      },
    });
  }

  async findOne(id: string) {
    const company = await this.companyRepo.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        jobs: true,
      },
    });
    if (!company) throw new NotFoundException('company not found');
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto, userId: string) {
    const company = await this.companyRepo.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });
    if (!company) throw new NotFoundException('company not found');

    const owner = await this.userService.findOne(userId);
    if (!owner) throw new NotFoundException('owner not found');

    if (company.owner.id !== owner.id) {
      throw new ForbiddenException(
        'only employers that owns the company can perform this action',
      );
    }

    Object.assign(company, dto);
    return this.companyRepo.save(company);
  }

  async remove(id: string, userId: string) {
    const owner = await this.userService.findOne(userId);
    if (!owner) throw new NotFoundException('owner not found');

    const company = await this.companyRepo.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });
    if (!company) throw new NotFoundException('company not found');

    if (company.owner.id !== owner.id) {
      throw new ForbiddenException(
        'only employers that owns the company can perform this action',
      );
    }

    await this.companyRepo.remove(company);
    return {
      message: 'company removed!',
    };
  }
}
