import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { Prescription, PrescriptionDocument } from '../prescriptions/schemas/prescription.schema';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async getPatientDashboard(patientId: string) {
    const pid = new Types.ObjectId(patientId);
    const now = new Date();

    const [upcomingAppointments, appointmentCount, prescriptionCount, paymentCount] =
      await Promise.all([
        this.appointmentModel
          .find({
            patientId: pid,
            appointmentDate: { $gte: now },
            status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
          })
          .populate('doctorId')
          .sort({ appointmentDate: 1 })
          .limit(5)
          .lean(),
        this.appointmentModel.countDocuments({ patientId: pid }),
        this.prescriptionModel.countDocuments({ patientId: pid }),
        this.paymentModel.countDocuments({ patientId: pid }),
      ]);

    return { upcomingAppointments, appointmentCount, prescriptionCount, paymentCount };
  }

  async getDoctorDashboard(doctorUserId: string) {
    const doctor = await this.doctorModel
      .findOne({ userId: new Types.ObjectId(doctorUserId) })
      .lean();
    if (!doctor) return { error: 'Doctor profile not found' };

    const did = doctor._id as Types.ObjectId;
    const now = new Date();

    const [upcomingAppointments, totalAppointments, reviews, uniquePatients] = await Promise.all([
      this.appointmentModel
        .find({
          doctorId: did,
          appointmentDate: { $gte: now },
          status: { $in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
        })
        .populate('patientId', 'fullName email')
        .sort({ appointmentDate: 1 })
        .limit(5)
        .lean(),
      this.appointmentModel.countDocuments({ doctorId: did }),
      this.reviewModel.find({ doctorId: did }).lean(),
      this.appointmentModel.distinct('patientId', { doctorId: did }),
    ]);

    const averageRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
        : 0;

    return {
      upcomingAppointments,
      totalAppointments,
      totalPatients: uniquePatients.length,
      averageRating,
    };
  }
}
