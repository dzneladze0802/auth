import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Users } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  public async create(userDto: CreateUserDto): Promise<{
    statusCode: HttpStatus;
    message: string;
  }> {
    try {
      const isUserExists = await this.checkIfUserExists(userDto?.email);

      if (isUserExists) {
        throw new NotFoundException('User already registered with this email.');
      }

      const createdUser = new this.usersModel(userDto);
      await createdUser.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Data is not valid',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async checkIfUserExists(email: string): Promise<boolean> {
    const user = this.usersModel.findOne({ email }).exec();

    if (user) {
      return true;
    }

    return false;
  }
}
