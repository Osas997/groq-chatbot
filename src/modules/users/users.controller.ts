import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { baseResponse } from 'src/helpers/base-response';
import { Public } from '../auth/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user (public)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return baseResponse('User created successfully', user);
  }
}
