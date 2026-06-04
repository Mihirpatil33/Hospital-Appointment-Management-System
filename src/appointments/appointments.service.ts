import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private doctorsService: DoctorsService,
  ) {}

  // POST /appointments — PATIENT only
  async create(patientId: string, dto: CreateAppointmentDto): Promise<AppointmentDocument> {
    // 1. Validate appointment date is in the future
    const appointmentDate = new Date(dto.appointmentDate);
    if (appointmentDate <= new Date()) {
      throw new BadRequestException('Appointment date must be in the future');
    }

    // 2. Verify doctor exists
    const doctor = await this.doctorsService.findOne(dto.doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // 3. Check doctor is available
    if (!doctor.isAvailable) {
      throw new BadRequestException('Doctor is currently not available');
    }

    // 4. Prevent duplicate: same patient + same doctor + same date slot (within 1 hour window)
    const oneHourBefore = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
    const oneHourAfter  = new Date(appointmentDate.getTime() + 60 * 60 * 1000);

    const duplicate = await this.appointmentModel.findOne({
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(dto.doctorId),
      appointmentDate: { $gte: oneHourBefore, $lte: oneHourAfter },
      status: { $nin: [AppointmentStatus.CANCELLED] },
    });

    if (duplicate) {
      throw new BadRequestException(
        'You already have an appointment with this doctor around that time',
      );
    }

    const appointment = new this.appointmentModel({
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(dto.doctorId),
      appointmentDate,
      reason: dto.reason,
      notes: dto.notes || '',
      status: AppointmentStatus.PENDING,
    });

    return appointment.save();
  }

  // GET /appointments/my-appointments — PATIENT sees their own appointments
  async findPatientAppointments(patientId: string): Promise<any[]> {
    return this.appointmentModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'fullName email' },
      })
      .sort({ appointmentDate: -1 })
      .lean();
  }

  // GET /appointments/doctor — DOCTOR sees appointments assigned to them
  async findDoctorAppointments(doctorUserId: string): Promise<any[]> {
    // Find doctor profile from userId
    const doctorProfile = await this.doctorsService.findByUserId(doctorUserId);
    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.appointmentModel
      .find({ doctorId: doctorProfile._id })
      .populate('patientId', 'fullName email')
      .sort({ appointmentDate: 1 })
      .lean();
  }

  // Shared helper to fetch and validate appointment ownership
  private async getAppointmentAndValidate(
    appointmentId: string,
    doctorUserId: string,
  ): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const doctorProfile = await this.doctorsService.findByUserId(doctorUserId);
    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    // Ensure this appointment belongs to the requesting doctor
    if (appointment.doctorId.toString() !== doctorProfile._id.toString()) {
      throw new ForbiddenException('This appointment does not belong to you');
    }

    return appointment;
  }

  // PATCH /appointments/:id/confirm — DOCTOR only
  async confirm(appointmentId: string, doctorUserId: string): Promise<any> {
    const appointment = await this.getAppointmentAndValidate(appointmentId, doctorUserId);

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        `Cannot confirm an appointment with status: ${appointment.status}`,
      );
    }

    appointment.status = AppointmentStatus.CONFIRMED;
    return appointment.save();
  }

  // PATCH /appointments/:id/cancel — DOCTOR only
  async cancel(appointmentId: string, doctorUserId: string): Promise<any> {
    const appointment = await this.getAppointmentAndValidate(appointmentId, doctorUserId);

    if (
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot cancel an appointment with status: ${appointment.status}`,
      );
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return appointment.save();
  }

  // PATCH /appointments/:id/reschedule — DOCTOR only
  async reschedule(
    appointmentId: string,
    doctorUserId: string,
    dto: RescheduleAppointmentDto,
  ): Promise<any> {
    const appointment = await this.getAppointmentAndValidate(appointmentId, doctorUserId);

    // New date must be in the future
    const newDate = new Date(dto.appointmentDate);
    if (newDate <= new Date()) {
      throw new BadRequestException('New appointment date must be in the future');
    }

    if (appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException(
        `Cannot reschedule an appointment with status: ${appointment.status}`,
      );
    }

    appointment.appointmentDate = newDate;
    appointment.status = AppointmentStatus.RESCHEDULED;
    if (dto.notes) appointment.notes = dto.notes;

    return appointment.save();
  }
}
