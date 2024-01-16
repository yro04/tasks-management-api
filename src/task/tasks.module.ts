import { Module } from '@nestjs/common';
import { TasksService } from './service/tasks.service';
import { TasksController } from './controller/tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PrismaModule],
})
export class TasksModule {}
