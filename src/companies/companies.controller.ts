import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/common/enums/user.role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all companies only for owner' })
  findAll(@CurrentUser() user: User) {
    return this.companiesService.findAll(user.id);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all companies only for admin' })
  findAllForAdmin() {
    return this.companiesService.findAllForAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.EMPLOYER)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.companiesService.remove(id, user.id);
  }
}
