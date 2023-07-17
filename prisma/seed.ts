import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      name: 'primary-owner',
      email: 'primary.owner@mail.com',
      password: bcrypt.hashSync('password', 10),
      phone: '+38165129026',
      role: 'OWNER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'primary-guest',
      email: 'primary.guest@mail.com',
      password: bcrypt.hashSync('password', 10),
      phone: '+38165129027',
      role: 'GUEST',
    },
  });

  const owner = await prisma.propertyOwner.create({
    data: {
      userId: user1.id,
    },
  });

  const guest = await prisma.guest.create({
    data: {
      userId: user2.id,
    },
  });

  const property = await prisma.property.create({
    data: {
      name: 'primary-property',
      description: 'primary-property-description',
      address: 'primary-property-address',
      price: 100,
      currency: 'USD',
      bedrooms: 1,
      bathrooms: 1,
      ownerId: owner.id,
    },
  });

  const reservation = await prisma.reservation.create({
    data: {
      checkIn: dayjs().add(1, 'day').toISOString(),
      checkOut: dayjs().add(2, 'day').toISOString(),
      propertyId: property.id,
      total: 100,
      currency: 'USD',
    },
  });

  await prisma.guestReservation.create({
    data: {
      guestId: guest.id,
      reservationId: reservation.id,
    },
  });

  const chat = await prisma.chat.create({
    data: {
      propertyId: property.id,
    },
  });

  const chatParticipant1 = await prisma.chatParticipant.create({
    data: {
      chatId: chat.id,
      userId: user1.id,
    },
  });

  const chatParticipant2 = await prisma.chatParticipant.create({
    data: {
      chatId: chat.id,
      userId: user2.id,
    },
  });

  await prisma.message.create({
    data: {
      chatId: chat.id,
      message: 'Hello',
      participantId: chatParticipant1.id,
    },
  });

  await prisma.message.create({
    data: {
      chatId: chat.id,
      message: 'hi',
      participantId: chatParticipant2.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
