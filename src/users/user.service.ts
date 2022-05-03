import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/createAccount.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    try {
      const exist = await this.users.findOne({ email: email });
      if (exist) {
        return [false, 'There is a user with that email already'];
      }
      await this.users.save(this.users.create({ email, password, role }));
      return [true];
    } catch (e) {
      // make error
      return [false, "Couldn't create account "];
    }
    // hash the pass
  }
  async Login({
    email,
    password,
  }: LoginInput): Promise<[boolean, string?, string?]> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return [false, 'There is no user with this email'];
      }
      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) {
        return [false, 'Wrong password'];
      }
      const token = this.jwtService.sign(user.id);
      return [true, '', token];
    } catch (e) {
      return [false, e.message];
    }
  }
}
