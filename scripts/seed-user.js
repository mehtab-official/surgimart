const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Test123!', 10)
  const user = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: {
      email: 'buyer@test.com',
      name: 'Test Buyer',
      role: 'buyer',
      passwordHash: passwordHash,
    },
  })
  console.log('Seeded buyer user:', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
