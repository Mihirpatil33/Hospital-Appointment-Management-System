import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
  // One-to-one link to the users collection
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // Not required at creation — doctor fills these in via PATCH /doctors/profile
  @Prop({ trim: true, default: '' })
  specialization: string;

  @Prop({ min: 0, default: 0 })
  experience: number;

  @Prop({ trim: true, default: '' })
  qualification: string;

  @Prop({ min: 0, default: 0 })
  consultationFee: number;

  @Prop({ trim: true, default: '' })
  about: string;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

// Text index for search by specialization
DoctorSchema.index({ specialization: 'text' });