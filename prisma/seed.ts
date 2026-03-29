import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@cinema.com'
  const adminPassword = 'admin123'
  
  console.log(`Seeding admin account: ${adminEmail}`)
  
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Super Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Admin account created / verified:', admin.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
