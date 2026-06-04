import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // All appointment routes require JWT
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  // PATIENT books an appointment
  @Post()
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Book an appointment (PATIENT only)' })
  @ApiResponse({ status: 201, description: 'Appointment booked' })
  @ApiResponse({ status: 400, description: 'Validation failed / duplicate / past date' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a patient' })
  create(@Request() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user._id.toString(), dto);
  }

  // PATIENT views their own appointments
  @Get('my-appointments')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Patient views their own appointments (PATIENT only)' })
  @ApiResponse({ status: 200, description: 'Appointments returned' })
  getMyAppointments(@Request() req: any) {
    return this.appointmentsService.findPatientAppointments(
      req.user._id.toString(),
    );
  }

  // DOCTOR views appointments assigned to them
  @Get('doctor')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Doctor views their appointments (DOCTOR only)' })
  @ApiResponse({ status: 200, description: 'Appointments returned' })
  getDoctorAppointments(@Request() req: any) {
    return this.appointmentsService.findDoctorAppointments(
      req.user._id.toString(),
    );
  }

  // DOCTOR confirms an appointment
  @Patch(':id/confirm')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Confirm an appointment (DOCTOR only)' })
  @ApiResponse({ status: 200, description: 'Appointment confirmed' })
  @ApiResponse({ status: 400, description: 'Cannot confirm — wrong status' })
  confirm(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.confirm(id, req.user._id.toString());
  }

  // DOCTOR cancels an appointment
  @Patch(':id/cancel')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Cancel an appointment (DOCTOR only)' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel — wrong status' })
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.cancel(id, req.user._id.toString());
  }

  // DOCTOR reschedules an appointment
  @Patch(':id/reschedule')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Reschedule an appointment (DOCTOR only)' })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled' })
  @ApiResponse({ status: 400, description: 'Cannot reschedule — past date or wrong status' })
  reschedule(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    return this.appointmentsService.reschedule(
      id,
      req.user._id.toString(),
      dto,
    );
  }
}
