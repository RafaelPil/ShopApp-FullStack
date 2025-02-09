import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Response } from 'express';
import ms, { StringValue } from 'ms'; // Import StringValue from ms
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    try {
      const expires = new Date();

      // Get the JWT expiration time from the configuration
      const jwtExpiration =
        this.configService.getOrThrow<string>('JWT_EXPIRATION');
      console.log('JWT_EXPIRATION:', jwtExpiration);

      // Explicitly cast jwtExpiration to StringValue
      const expirationInMilliseconds = ms(jwtExpiration as StringValue);
      if (!expirationInMilliseconds) {
        throw new Error('Invalid JWT_EXPIRATION value');
      }
      console.log('Expiration in milliseconds:', expirationInMilliseconds);

      // Add the expiration time to the current date
      expires.setMilliseconds(
        expires.getMilliseconds() + expirationInMilliseconds,
      );
      console.log('Expires:', expires);

      const tokenPayload: TokenPayload = {
        userId: user.id,
      };
      console.log('Token Payload:', tokenPayload);

      const token = this.jwtService.sign(tokenPayload);
      console.log('Generated Token:', token);

      response.cookie('Authentication', token, {
        secure: true, // Set to false for development
        httpOnly: true,
        expires,
      });

      return { tokenPayload };
    } catch (error) {
      console.error('Error in login method:', error);
      throw error; // Re-throw the error to see it in the response
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }
}
