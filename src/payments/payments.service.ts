import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument, PaymentStatus } from './schemas/payment.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async pay(patientId: string, dto: CreatePaymentDto): Promise<Payment> {
    const appointment = await this.appointmentModel.findById(dto.appointmentId).lean();
    if (!appointment) throw new NotFoundException('Appointment not found');

    if (appointment.patientId.toString() !== patientId) {
      throw new ForbiddenException('This is not your appointment');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot pay for a cancelled appointment');
    }

    const existing = await this.paymentModel
      .findOne({ appointmentId: new Types.ObjectId(dto.appointmentId) })
      .lean();
    if (existing) throw new BadRequestException('Payment already made for this appointment');

    return this.paymentModel.create({
      appointmentId: new Types.ObjectId(dto.appointmentId),
      patientId: new Types.ObjectId(patientId),
      amount: dto.amount,
      status: PaymentStatus.SUCCESS,
      paymentMethod: dto.paymentMethod,
      paidAt: new Date(),
    });
  }

  async getHistory(patientId: string): Promise<Payment[]> {
    return this.paymentModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .populate('appointmentId')
      .sort({ paidAt: -1 })
      .lean();
  }
}
