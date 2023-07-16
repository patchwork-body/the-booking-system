import {
  Chat,
  Guest,
  GuestReservation,
  Property,
  PropertyOwner,
  Reservation,
  User,
} from '@prisma/client';
import { prisma } from './prisma/client';
import dayjs from 'dayjs';

export interface PropertyService {
  byId: (
    id: string,
    includeOwner?: boolean,
    includeGuests?: boolean,
  ) => Promise<
    | (Property & { owner?: PropertyOwner & { user?: Pick<User, 'name' | 'email'> } } & {
        reservations?: Array<
          Reservation & {
            guests?: Array<
              GuestReservation & { guest?: Guest & { user?: Pick<User, 'name' | 'email'> } }
            >;
          }
        >;
      })
    | null
  >;
  list: (cursor?: string) => Promise<Property[]>;
  create: (
    property: Pick<
      Property,
      | 'name'
      | 'description'
      | 'address'
      | 'price'
      | 'price'
      | 'currency'
      | 'bathrooms'
      | 'bedrooms'
      | 'ownerId'
    >,
  ) => Promise<Property>;

  update: (
    id: string,
    property: Partial<
      Pick<
        Property,
        | 'name'
        | 'description'
        | 'address'
        | 'price'
        | 'price'
        | 'currency'
        | 'bathrooms'
        | 'bedrooms'
      >
    >,
  ) => Promise<Property>;

  delete: (id: string) => Promise<Property>;

  reservations: (id: string) => Promise<
    Array<
      Reservation & {
        guests: Array<
          GuestReservation & {
            guest: Guest & { user: Pick<User, 'name' | 'email' | 'phone'> };
          }
        >;
      }
    >
  >;

  reserve: (
    reservation: Pick<Reservation, 'propertyId' | 'checkIn' | 'checkOut'> & {
      guestIds: string[];
    },
  ) => Promise<Reservation>;

  owner: (
    id: string,
  ) => Promise<
    (Property & { owner: PropertyOwner & { user: Pick<User, 'name' | 'email' | 'phone'> } }) | null
  >;
  chats: (id: string) => Promise<Array<Chat>>;
}

export const propertyService: PropertyService = {
  byId: async (id, includeOwner, includeGuests) => {
    return prisma.property.findUnique({
      where: { id },
      include: {
        owner: includeOwner && { include: { user: { select: { name: true, email: true } } } },

        reservations: includeGuests && {
          include: {
            guests: {
              include: { guest: { include: { user: { select: { name: true, email: true } } } } },
            },
          },
        },
      },
    });
  },

  list: async (cursor) => {
    return prisma.property.findMany({
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  },

  create: async (property) => {
    const { ownerId, ...rest } = property;

    return prisma.property.create({
      data: {
        ...rest,
        owner: {
          connect: {
            id: ownerId,
          },
        },
      },
    });
  },

  update: async (id, property) => {
    return prisma.property.update({
      where: { id },
      data: property,
    });
  },

  delete: async (id) => {
    return prisma.property.delete({
      where: { id },
    });
  },

  reservations: async (id) => {
    return prisma.reservation.findMany({
      where: {
        propertyId: id,
      },

      include: {
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

  reserve: async (reservation) => {
    const property = await prisma.property.findUnique({
      where: {
        id: reservation.propertyId,
      },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const total =
      property.price *
      (dayjs(reservation.checkOut).diff(dayjs(reservation.checkIn)) * reservation.guestIds.length);
    const currency = property.currency;

    return prisma.reservation.create({
      data: {
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: {
          createMany: { data: reservation.guestIds.map((guestId) => ({ guestId })) },
        },
        property: {
          connect: { id: reservation.propertyId },
        },
        total,
        currency,
      },
    });
  },

  owner: async (id) => {
    return prisma.property.findUnique({
      where: {
        id,
      },

      include: {
        owner: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
      },
    });
  },

  chats: async (id) => {
    return prisma.chat.findMany({
      where: {
        propertyId: id,
      },
    });
  },
};
