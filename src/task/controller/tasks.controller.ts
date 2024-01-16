import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from '../service/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // Validate the incoming DTO
  @ApiCreatedResponse({ type: TaskEntity })
  @HttpCode(HttpStatus.CREATED)
  async createTasks(@Body() createTaskDto: CreateTaskDto) {
    try {
      const task = await this.tasksService.create(createTaskDto);
      return { task };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOkResponse({ type: TaskEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  async findAllTasks() {
    try {
      const tasks = await this.tasksService.findAll();
      return  tasks;
    } catch (error) {
      throw new HttpException(error.message ||'Failed to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('drafts')
  @ApiOkResponse({ type: TaskEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  async findDraftsTasks() {
    try {
      const drafts = await this.tasksService.findDrafts();
      return { drafts };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to retrieve drafts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskEntity })
  @HttpCode(HttpStatus.OK)
  async findOneTask(@Param('id', ParseIntPipe) id: number) {
    try {
      const task = await this.tasksService.findOne(id);
      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      return { task };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to retrieve task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true })) // Validate the incoming DTO
  @ApiOkResponse({ type: TaskEntity })
  @HttpCode(HttpStatus.OK) // default status code - explicitly setting it might be redundant.
  async updateTasks(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const updatedTask = await this.tasksService.update(id, updateTaskDto);
      return { updatedTask };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: TaskEntity })
  @HttpCode(HttpStatus.OK)
  async removeTasks(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletedTask = await this.tasksService.remove(id);
      if (!deletedTask) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      return { deletedTask };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
