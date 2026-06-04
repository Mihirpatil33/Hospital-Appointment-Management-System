import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Patient dashboard (PATIENT only)' })
  patientDashboard(@Request() req) {
    return this.dashboardService.getPatientDashboard(req.user.sub);
  }

  @Get('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Doctor dashboard (DOCTOR only)' })
  doctorDashboard(@Request() req) {
    return this.dashboardService.getDoctorDashboard(req.user.sub);
  }
}
