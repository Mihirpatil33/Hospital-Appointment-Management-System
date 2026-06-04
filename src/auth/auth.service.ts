import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { DoctorsService } from '../doctors/doctors.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private doctorsService: DoctorsService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    if (user.role === Role.DOCTOR) {
      await this.doctorsService.createProfile(user._id.toString());
    }
    const { password, ...result } = user.toObject();
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
