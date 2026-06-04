import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: '' })
  specialization: string;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: '' })
  qualification: string;

  @Prop({ default: 0 })
  consultationFee: number;

  @Prop({ default: '' })
  about: string;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
