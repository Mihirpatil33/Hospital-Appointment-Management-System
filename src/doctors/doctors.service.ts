import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  // Called automatically after DOCTOR registers to create an empty profile
  async createProfile(userId: string): Promise<DoctorDocument> {
    const existing = await this.doctorModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (existing) {
      throw new ConflictException('Doctor profile already exists');
    }

    const profile = new this.doctorModel({
      userId: new Types.ObjectId(userId),
      specialization: '',
      experience: 0,
      qualification: '',
      consultationFee: 0,
    });

    return profile.save();
  }

  // GET /doctors — list all available doctors with user info
  async findAll(): Promise<any[]> {
    return this.doctorModel
      .find({ isAvailable: true })
      .populate('userId', 'fullName email') // join user name + email
      .lean();
  }

  // GET /doctors/:id
  async findOne(id: string): Promise<any> {
    const doctor = await this.doctorModel
      .findById(id)
      .populate('userId', 'fullName email')
      .lean();

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  // Find doctor profile by userId (used internally)
  async findByUserId(userId: string): Promise<DoctorDocument | null> {
    return this.doctorModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  // PATCH /doctors/profile — doctor updates their own profile
  async updateProfile(userId: string, dto: UpdateDoctorDto): Promise<any> {
    const profile = await this.doctorModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: dto },
        { new: true }, // return updated document
      )
      .populate('userId', 'fullName email')
      .lean();

    if (!profile) {
      throw new NotFoundException(
        'Doctor profile not found. Please contact support.',
      );
    }

    return profile;
  }

  // GET /doctors/search?name=john&specialization=cardiology
  // Debouncing note: debounce is applied on the FRONTEND before this API is called.
  // The frontend waits 400ms after the user stops typing before sending the request.
  // This reduces unnecessary API calls (e.g. typing "Car" doesn't fire 3 requests).
  async search(name?: string, specialization?: string): Promise<any[]> {
    const query: any = {};

    if (specialization) {
      // Case-insensitive partial match on specialization
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    let doctors = await this.doctorModel
      .find(query)
      .populate('userId', 'fullName email')
      .lean();

    // Filter by name after populate (fullName lives on the User document)
    if (name) {
      const lowerName = name.toLowerCase();
      doctors = doctors.filter((d: any) =>
        d.userId?.fullName?.toLowerCase().includes(lowerName),
      );
    }

    return doctors;
  }
}
