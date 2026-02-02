import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function setPassword() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const updated = await prisma.user.update({
    where: { phone: '0000000000' },
    data: { passwordHash: hashedPassword },
  });

  console.log('✅ Password set for:', updated.phone);
  console.log('Phone: 0000000000');
  console.log('Password: Admin@123');
}

setPassword()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });