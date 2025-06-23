import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.rant.create({
    data: {
      content: 'Welcome to RantSpace! 😤',
      nickname: 'SeederBot',
    },
  });
}

main()
  .then(() => {
    console.log('✅ Seeding complete');
  })
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
