import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DoctorsService } from './doctors.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'List all available doctors' })
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search doctors by name or specialization' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'specialization', required: false })
  search(@Query('name') name?: string, @Query('specialization') specialization?: string) {
    return this.doctorsService.search(name, specialization);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Update own doctor profile (DOCTOR only)' })
  updateProfile(@Request() req, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.updateProfile(req.user.sub, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  findById(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }
}
