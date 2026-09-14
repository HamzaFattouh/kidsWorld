import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@kidsworld.com' },
    update: {
        passwordHash,
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
    },
    create: {
      email: 'admin@kidsworld.com',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('Admin user created:', user.email);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
