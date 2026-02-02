import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR_MESSAGES } from '../common/constants/constant';
import { generateOtp } from '../utils/util';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: { email: loginDto.email, role: Role.MANAGER },
      });
    }
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: hashedOtp },
    });
    return { otp };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: verifyOtpDto.email },
    });
    if (!user || !user.otp) {
      throw new NotFoundException(ERROR_MESSAGES.INVALID_OTP);
    }
    const isValid = await bcrypt.compare(verifyOtpDto.otp, user.otp);
    if (!isValid) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OTP);
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: null },
    });
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
