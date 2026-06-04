import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Doctor, DoctorDocument } from '../doctors/schemas/doctor.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(patientId: string, dto: CreateReviewDto): Promise<Review> {
    const doctor = await this.doctorModel.findById(dto.doctorId).lean();
    if (!doctor) throw new NotFoundException('Doctor not found');

    const existing = await this.reviewModel.findOne({
      doctorId: new Types.ObjectId(dto.doctorId),
      patientId: new Types.ObjectId(patientId),
    }).lean();
    if (existing) throw new ConflictException('You have already reviewed this doctor');

    return this.reviewModel.create({
      doctorId: new Types.ObjectId(dto.doctorId),
      patientId: new Types.ObjectId(patientId),
      rating: dto.rating,
      comment: dto.comment ?? '',
    });
  }

  async getDoctorReviews(doctorId: string): Promise<Review[]> {
    const doctor = await this.doctorModel.findById(doctorId).lean();
    if (!doctor) throw new NotFoundException('Doctor not found');

    return this.reviewModel
      .find({ doctorId: new Types.ObjectId(doctorId) })
      .populate('patientId', 'fullName')
      .lean();
  }
}
