import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Book appointment (PATIENT only)' })
  create(@Request() req, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.sub, dto);
  }

  @Get('my-appointments')
  @UseGuards(RolesGuard)
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: "Patient's own appointments (PATIENT only)" })
  myAppointments(@Request() req) {
    return this.appointmentsService.getPatientAppointments(req.user.sub);
  }

  @Get('doctor')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: "Doctor's appointments (DOCTOR only)" })
  doctorAppointments(@Request() req) {
    return this.appointmentsService.getDoctorAppointments(req.user.sub);
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Confirm appointment (DOCTOR only)' })
  confirm(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.confirm(id, req.user.sub);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Cancel appointment (DOCTOR only)' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.cancel(id, req.user.sub);
  }

  @Patch(':id/reschedule')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Reschedule appointment (DOCTOR only)' })
  reschedule(@Param('id') id: string, @Request() req, @Body() dto: RescheduleAppointmentDto) {
    return this.appointmentsService.reschedule(id, req.user.sub, dto);
  }
}
