import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { CommentEntity } from '../comment/entities/comment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  async findAll() {
    const arr = await this.repository
      .createQueryBuilder('u')
      .leftJoinAndMapMany(
        'u.comments',
        CommentEntity,
        'comment',
        'comment.userId = u.id',
      )
      .loadRelationCountAndMap('u.commentsCount', 'u.comments', 'comments')
      .getMany();

    return arr.map((obj) => {
      delete obj.comments;
      return obj;
    });
  }

  findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  findByCondition(condition: LoginUserDto) {
    return this.repository.findOne({
      where: { email: condition.email, password: condition.password },
    });
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.fullName) {
      qb.andWhere(`u.fullName ILIKE :fullName`);
    }

    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }

    qb.setParameters({
      email: `%${dto.email}%`,
      fullName: `%${dto.fullName}%`,
    });

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }
}
