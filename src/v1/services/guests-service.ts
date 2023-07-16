import { Reservation, GuestReservation, ChatParticipant, Chat } from '@prisma/client';
import { prisma } from './prisma/client';

export interface GuestService {
  reservations: (id: string) => Promise<Array<GuestReservation & { reservation: Reservation }>>;
  chats: (id: string) => Promise<Array<ChatParticipant & { chat: Chat }>>;
}

export const guestService: GuestService = {
  reservations: async (id) => {
    return prisma.guestReservation.findMany({
      where: {
        guestId: id,
      },

      include: {
        reservation: true,
      },
    });
  },

  chats: async (id) => {
    return prisma.chatParticipant.findMany({
      where: {
        id,
      },

      include: {
        chat: true,
      },
    });
  },
};
