import {
  Guest,
  GuestReservation,
  Property,
  PropertyOwner,
  Reservation,
  User,
} from '@prisma/client';
import { prisma } from './prisma/client';

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
};
