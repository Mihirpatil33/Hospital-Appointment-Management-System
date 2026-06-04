import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  // Public — anyone can list doctors
  @Get()
  @ApiOperation({ summary: 'Get all available doctors' })
  @ApiResponse({ status: 200, description: 'List of doctors returned' })
  findAll() {
    return this.doctorsService.findAll();
  }

  // Public — search must come before :id to avoid route conflict
  @Get('search')
  @ApiOperation({ summary: 'Search doctors by name or specialization' })
  @ApiQuery({ name: 'name', required: false, example: 'John' })
  @ApiQuery({ name: 'specialization', required: false, example: 'Cardiology' })
  @ApiResponse({ status: 200, description: 'Search results returned' })
  search(
    @Query('name') name?: string,
    @Query('specialization') specialization?: string,
  ) {
    return this.doctorsService.search(name, specialization);
  }

  // JWT protected — only DOCTOR role can update their own profile
  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Doctor updates their own profile (DOCTOR only)' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a doctor' })
  updateProfile(@Request() req: any, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.updateProfile(req.user._id.toString(), dto);
  }

  // Public — view single doctor details
  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  @ApiResponse({ status: 200, description: 'Doctor details returned' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }
}
