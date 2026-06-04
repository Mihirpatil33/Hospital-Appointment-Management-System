import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ default: AppointmentStatus.PENDING, enum: AppointmentStatus })
  status: AppointmentStatus;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: '' })
  notes: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
