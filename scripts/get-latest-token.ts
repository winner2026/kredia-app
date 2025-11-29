import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { email: true, verificationToken: true, name: true }
  });

  if (user) {
    console.log('\n--- ÚLTIMO USUARIO REGISTRADO ---');
    console.log(`Email: ${user.email}`);
    console.log(`Nombre: ${user.name}`);
    console.log(`Token: ${user.verificationToken}`);
    if (user.verificationToken) {
      console.log(`\n>>> URL DE VERIFICACIÓN: http://localhost:3000/verify-email?token=${user.verificationToken} <<<\n`);
    } else {
      console.log('Este usuario ya está verificado o no tiene token.');
    }
  } else {
    console.log('No se encontraron usuarios.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
