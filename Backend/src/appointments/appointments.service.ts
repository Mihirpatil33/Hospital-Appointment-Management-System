import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(patientId: string, dto: CreateAppointmentDto): Promise<Appointment> {
    const apptDate = new Date(dto.appointmentDate);
    if (apptDate <= new Date()) throw new BadRequestException('Appointment date must be in the future');

    const doctor = await this.doctorModel.findById(dto.doctorId).lean();
    if (!doctor) throw new NotFoundException('Doctor not found');
    if (!doctor.isAvailable) throw new BadRequestException('Doctor is not available');

    const oneHourBefore = new Date(apptDate.getTime() - 60 * 60 * 1000);
    const oneHourAfter = new Date(apptDate.getTime() + 60 * 60 * 1000);
    const duplicate = await this.appointmentModel.findOne({
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(dto.doctorId),
      appointmentDate: { $gte: oneHourBefore, $lte: oneHourAfter },
      status: { $nin: [AppointmentStatus.CANCELLED] },
    });
    if (duplicate) throw new BadRequestException('You already have an appointment with this doctor within 1 hour');

    return this.appointmentModel.create({
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(dto.doctorId),
      appointmentDate: apptDate,
      reason: dto.reason,
      notes: dto.notes ?? '',
    });
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .populate({
  path: 'doctorId',
  populate: { path: 'userId', select: 'fullName email' },
})
      .sort({ appointmentDate: -1 })
      .lean();
  }

  async getDoctorAppointments(doctorUserId: string): Promise<Appointment[]> {
    const doctor = await this.doctorModel.findOne({ userId: new Types.ObjectId(doctorUserId) }).lean();
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    return this.appointmentModel
      .find({ doctorId: doctor._id })
      .populate('patientId', 'fullName email')
      .sort({ appointmentDate: -1 })
      .lean();
  }

  private async getOwnAppointment(id: string, doctorUserId: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel.findById(id).populate('doctorId');
    if (!appointment) throw new NotFoundException('Appointment not found');

    const doctor = appointment.doctorId as any;
    if (doctor.userId.toString() !== doctorUserId) {
      throw new ForbiddenException('Not your appointment');
    }
    return appointment;
  }

  async confirm(id: string, doctorUserId: string): Promise<Appointment> {
    const appt = await this.getOwnAppointment(id, doctorUserId);
    if (appt.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(`Cannot confirm appointment with status: ${appt.status}`);
    }
    appt.status = AppointmentStatus.CONFIRMED;
    return appt.save();
  }

  async cancel(id: string, doctorUserId: string): Promise<Appointment> {
    const appt = await this.getOwnAppointment(id, doctorUserId);
    if (appt.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }
    appt.status = AppointmentStatus.CANCELLED;
    return appt.save();
  }

  async reschedule(id: string, doctorUserId: string, dto: RescheduleAppointmentDto): Promise<Appointment> {
    const newDate = new Date(dto.appointmentDate);
    if (newDate <= new Date()) throw new BadRequestException('New date must be in the future');

    const appt = await this.getOwnAppointment(id, doctorUserId);
    if ([AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED].includes(appt.status)) {
      throw new BadRequestException(`Cannot reschedule appointment with status: ${appt.status}`);
    }
    appt.appointmentDate = newDate;
    appt.status = AppointmentStatus.RESCHEDULED;
    return appt.save();
  }
}
