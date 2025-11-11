import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, confirm_password, ...data } = createUserDto;

    if (password !== confirm_password) {
      throw new BadRequestException('password tidak sama');
    }

    const isUserExist = await this.findByUsername(data.username);
    if (isUserExist) {
      throw new BadRequestException('username sudah terdaftar');
    }

    const user = this.userRepository.create({ ...data });
    user.password = await bcrypt.hash(password, 10);
    return await this.userRepository.save(user);
  }

  async updateRefreshToken(user_id: string, refreshToken: string | null) {
    return await this.userRepository.update({ id: user_id }, { refreshToken });
  }
}
