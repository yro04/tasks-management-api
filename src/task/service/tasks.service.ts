import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      return await this.prisma.task.create({ data: createTaskDto });
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation
        throw new ConflictException('Task with the same title already exists.');
      }
      throw new InternalServerErrorException('Failed to create task.');
    }
  }

  async findDrafts() {
    try {
      return await this.prisma.task.findMany({ where: { published: false } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve drafts.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.task.findMany({ orderBy: { id: 'asc' } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks.');
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id } });
      if (!task) {
        throw new NotFoundException('Task not found.');
      }
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve task.');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const existingTask = await this.prisma.task.findUnique({ where: { id } });
      if (!existingTask) {
        throw new NotFoundException('Task not found.');
      }

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: { ...existingTask, ...updateTaskDto },
      });

      if (!updatedTask) {
        throw new NotFoundException('Task not found after update.'); // Handle the case where the update didn't affect any rows
      }

      return updatedTask;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task.');
    }
  }

  async remove(id: number) {
    try {
      const deletedTask = await this.prisma.task.delete({ where: { id } });
      if (!deletedTask) {
        throw new NotFoundException('Task not found.');
      }
      return deletedTask;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete task.');
    }
  }
}
