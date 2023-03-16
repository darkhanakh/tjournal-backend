import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() request) {
    return this.userService.findById(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@Request() request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+request.user.id, updateUserDto);
  }

  @Get('search')
  search(@Query() dto: SearchUserDto) {
    return this.userService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }
}
