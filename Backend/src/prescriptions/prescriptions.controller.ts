import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Create prescription (DOCTOR only, appointment must be COMPLETED)' })
  create(@Request() req, @Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(req.user.sub, dto);
  }

  @Get('patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Get own prescription history (PATIENT only)' })
  getMyPrescriptions(@Request() req) {
    return this.prescriptionsService.getPatientPrescriptions(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get prescription by ID' })
  getById(@Param('id') id: string, @Request() req) {
    return this.prescriptionsService.getById(id, req.user.sub, req.user.role);
  }
}
