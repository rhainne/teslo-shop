import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const hashedPassword = bcrypt.hashSync(password, 10);
      createUserDto.password = hashedPassword;

      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJWToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      select: ['email', 'password', 'id'],
      where: { email },
    });

    if (!user)
      throw new BadRequestException('Invalid credentials');

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid)
      throw new BadRequestException('Invalid credentials');

    return {
      ...user,
      token: this.getJWToken({ id: user.id })
    };
  }

  private getJWToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException('User already exists: ', error.detail);

    console.error('Database error:', error);

    throw new BadRequestException(
      'An unexpected error occurred while creating the user. Please check server logs. '
    );
  }

}
