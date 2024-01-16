import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const task1 = await prisma.task.upsert({
    where: { title: 'This is the first task' },
    update: {},
    create: {
      title: 'This is the first task',
      description: `This interview challenge is designed to assess a candidate ability to build a 
                          full-stack web application using a combination of front-end and back-end technologies.`,
      published: false,
    },
  });

  const task2 = await prisma.task.upsert({
    where: { title: 'This is the second task' },
    update: {},
    create: {
      title: 'This is the second task',
      description: `This interview challenge is designed to assess a candidate ability to build a 
                          full-stack web application using a combination of front-end and back-end technologies.`,
      published: true,
    },
  });

  console.log(task1, task2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
