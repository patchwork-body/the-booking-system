import { Reservation, GuestReservation, Guest, User, Property } from '@prisma/client';
import { prisma } from './prisma/client';

export interface ReservationService {
  byId: (id: string) => Promise<
    | (Reservation & {
        property: Pick<Property, 'ownerId'>;
        guests: Array<
          GuestReservation & {
            guest: Guest & { user: Pick<User, 'name' | 'email' | 'phone'> };
          }
        >;
      })
    | null
  >;
}

export const reservationService: ReservationService = {
  byId: async (id) => {
    return prisma.reservation.findUnique({
      where: {
        id,
      },

      include: {
        property: {
          select: { ownerId: true },
        },

        guests: {
          include: {
            guest: {
              include: {
                user: { select: { name: true, email: true, phone: true } },
              },
            },
          },
        },
      },
    });
  },
};
