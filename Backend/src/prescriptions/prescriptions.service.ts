import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Prescription, PrescriptionDocument } from './schemas/prescription.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(doctorUserId: string, dto: CreatePrescriptionDto): Promise<Prescription> {
    const appointment = await this.appointmentModel
      .findById(dto.appointmentId)
      .populate('doctorId')
      .lean();
    if (!appointment) throw new NotFoundException('Appointment not found');

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Prescription can only be added to COMPLETED appointments');
    }

    const doctor = appointment.doctorId as any;
    if (doctor.userId.toString() !== doctorUserId) {
      throw new ForbiddenException('You can only add prescriptions to your own appointments');
    }

    const existing = await this.prescriptionModel.findOne({ appointmentId: dto.appointmentId }).lean();
    if (existing) throw new BadRequestException('Prescription already exists for this appointment');

    return this.prescriptionModel.create({
      appointmentId: new Types.ObjectId(dto.appointmentId),
      patientId: appointment.patientId,
      doctorId: (appointment.doctorId as any)._id,
      diagnosis: dto.diagnosis,
      prescription: dto.prescription,
      treatmentPlan: dto.treatmentPlan ?? '',
    });
  }

  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    return this.prescriptionModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .populate('appointmentId')
      .populate('doctorId')
      .lean();
  }

  async getById(id: string, requesterId: string, requesterRole: string): Promise<Prescription> {
    const prescription = await this.prescriptionModel
      .findById(id)
      .populate('appointmentId')
      .populate('doctorId')
      .lean();
    if (!prescription) throw new NotFoundException('Prescription not found');

    if (requesterRole === 'PATIENT' && prescription.patientId.toString() !== requesterId) {
      throw new ForbiddenException('Access denied');
    }
    return prescription;
  }
}
