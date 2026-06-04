import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

  async createProfile(userId: string): Promise<Doctor> {
    return this.doctorModel.create({ userId: new Types.ObjectId(userId) });
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find({ isAvailable: true }).populate('userId', 'fullName email').lean();
  }

  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel
      .findById(id)
      .populate('userId', 'fullName email')
      .lean();
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async updateProfile(userId: string, dto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.doctorModel
      .findOneAndUpdate({ userId: new Types.ObjectId(userId) }, dto, { new: true })
      .lean();
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return doctor;
  }

  async search(name?: string, specialization?: string): Promise<Doctor[]> {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ];

    const match: any = { isAvailable: true };
    if (specialization) {
      match.specialization = { $regex: specialization, $options: 'i' };
    }
    if (name) {
      match['user.fullName'] = { $regex: name, $options: 'i' };
    }

    pipeline.push({ $match: match });
    return this.doctorModel.aggregate(pipeline);
  }
}
