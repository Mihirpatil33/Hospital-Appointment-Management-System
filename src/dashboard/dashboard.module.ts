import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../appointments/schemas/appointment.schema';
import { Prescription, PrescriptionSchema } from '../prescriptions/schemas/prescription.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
