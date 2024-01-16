import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from '../service/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, PrismaService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and return it', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        published: true,
      };
      const createdTask: TaskEntity = {
        id: 1,
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(tasksService, 'create').mockResolvedValue(createdTask);

      const result = await controller.createTasks(createTaskDto);

      expect(result).toEqual({ task: createdTask });
    });

    it('should handle errors during task creation', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        published: false,
      };

      jest
        .spyOn(tasksService, 'create')
        .mockRejectedValue(new Error('Failed to create task'));

      await expect(controller.createTasks(createTaskDto)).rejects.toThrowError(
        HttpException,
      );
    });
  });

  describe('update', () => {
    it('should update a task and return it', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        published: true,
      };
      const existingTask: TaskEntity = {
        id: taskId,
        title: 'Existing Task',
        published: false,
        description: 'Task description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(tasksService, 'findOne').mockResolvedValue(existingTask);
      jest
        .spyOn(tasksService, 'update')
        .mockResolvedValue({ ...existingTask, ...updateTaskDto });

      const result = await controller.updateTasks(taskId, updateTaskDto);

      expect(result).toEqual({
        updatedTask: { ...existingTask, ...updateTaskDto },
      });
    });

    it('should handle service update error', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        published: true,
      };
      const existingTask: TaskEntity = {
        id: taskId,
        title: 'Existing Task',
        description: 'This is the description',
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(tasksService, 'findOne').mockResolvedValue(existingTask);
      jest
        .spyOn(tasksService, 'update')
        .mockRejectedValue(new Error('Service update error'));

      await expect(
        controller.updateTasks(taskId, updateTaskDto),
      ).rejects.toThrowError(
        new HttpException(
          'Service update error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a task and return it', async () => {
      const taskId = 1;
      const deletedTask: TaskEntity = {
        id: taskId,
        title: 'Deleted Task',
        description: 'This is the description',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(tasksService, 'remove').mockResolvedValue(deletedTask);

      const result = await controller.removeTasks(taskId);

      expect(result).toEqual({ deletedTask });
    });

    it('should handle not found task', async () => {
      const taskId = 1;

      jest.spyOn(tasksService, 'remove').mockResolvedValue(null);

      await expect(controller.removeTasks(taskId)).rejects.toThrowError(
        new HttpException('Task not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should handle service remove error', async () => {
      const taskId = 1;

      jest
        .spyOn(tasksService, 'remove')
        .mockRejectedValue(new Error('Service remove error'));

      await expect(controller.removeTasks(taskId)).rejects.toThrowError(
        new HttpException(
          'Service remove error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findAll', () => {
    const tasks: TaskEntity[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'This is the description',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'This is the description',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    it('should retrieve all tasks', async () => {
      jest.spyOn(tasksService, 'findAll').mockResolvedValue(tasks);

      const result = await controller.findAllTasks();

      expect(result).toEqual({ tasks });
    });

    it('should handle service findAll error', async () => {
      jest
        .spyOn(tasksService, 'findAll')
        .mockRejectedValue(new Error('Service findAll error'));

      await expect(controller.findAllTasks()).rejects.toThrowError(
        new HttpException(
          'Service findAll error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
