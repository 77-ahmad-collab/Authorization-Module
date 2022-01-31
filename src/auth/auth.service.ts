import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from 'src/users/DTO/user';
import { User } from 'src/Model/user';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private user: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signup(body: UserDto) {
    try {
      const { name, email, password } = body;
      const user = await this.user.findOne({ email });
      if (user) throw new BadRequestException('Email that already exists');
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const hashedPassword = hash.toString('hex') + '.' + salt.toString();
      const result = await this.user.create({
        name,
        email,
        password: hashedPassword,
      });
      return { message: 'Account has been created', name, email };
    } catch (error) {
      throw new Error(error);
    }
  }
  async validateUser(username: string, password: string) {
    try {
      const user = await this.user.findOne({ email: username });
      if (!user) throw new UnauthorizedException('User not found');
      const [storedHash, salt] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      if (storedHash == hash.toString('hex')) return user;
      else throw new BadRequestException('Invalid Credentials');
    } catch (error) {
      throw new Error(error);
    }
  }
  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
