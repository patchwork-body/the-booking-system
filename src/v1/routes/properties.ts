import { propertyService } from '@app/v1/services';
import { Request, Response, Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { logger } from 'src/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isAuthorized } from '../middlewares/authorized';
import { isOwner } from '../middlewares/is-owner';

export const propertiesRouter = Router();

propertiesRouter.get(
  '/properties',
  validateRequest({
    query: z.object({
      cursor: z.string().optional(),
    }),
  }),
  async (req, res) => {
    const properties = await propertyService.list(req.query.cursor);

    res.status(200).json({
      items: await propertyService.list(req.query.cursor),
      cursor: properties[properties.length - 1]?.id,
    });
  },
);

propertiesRouter.get(
  '/properties/:id',
  validateRequest({
    query: z.object({
      include: z.array(z.string()).optional(),
    }),
  }),
  async (req, res) => {
    const includeOwner = req.query.include?.includes('owner');
    const includeGuests = req.query.include?.includes('guests');

    try {
      const property = await propertyService.byId(req.params.id, includeOwner, includeGuests);

      if (property?.owner) {
        const { user, ...owner } = property.owner;

        property.owner = {
          ...owner,
          ...user,
        };
      }

      let guests;

      if (property?.reservations) {
        guests = property.reservations.map((reservation) => {
          const { guests: guestReservations, ...rest } = reservation;

          const guests = guestReservations?.map(({ guest }) => {
            const user = guest?.user;
            delete guest?.user;

            return {
              ...guest,
              ...user,
            };
          });

          return {
            ...rest,
            guests,
          };
        });

        delete property.reservations;
      }

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      return res.status(200).json({ ...property, guests });
    } catch (error) {
      logger.fatal(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

propertiesRouter.post(
  '/properties',
  isAuthorized,
  isOwner(),
  validateRequest({
    body: z.object({
      name: z.string().min(1).max(255),
      description: z.string().max(255).nullable().optional(),
      address: z.string().min(1).max(255),
      price: z.number().min(0),
      currency: z.string().min(3).max(3),
      bedrooms: z.number().min(0),
      bathrooms: z.number().min(0),
    }),
  }),
  async (req: Request, res: Response) => {
    logger.info(`Creating property ${req.body.name} by user ${req.jwtPayload?.ownerId}`);

    try {
      const property = await propertyService.create({
        ...req.body,
        ownerId: req.jwtPayload?.ownerId,
      });

      logger.debug('Property created', property);
      logger.info(`Property ${property.id} created by user ${req.jwtPayload?.ownerId}`);

      return res.status(201).json(property);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.message.includes('Unique constraint failed')
      ) {
        logger.error(error.message);
        return res.status(400).json({ message: 'The property with this name already exists' });
      }

      logger.fatal(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

propertiesRouter.post(
  '/properties/:id',
  isAuthorized,
  isOwner({ certain: true }),
  validateRequest({
    body: z.object({
      name: z.string().min(1).max(255).optional(),
      description: z.string().max(255).nullable().optional(),
      address: z.string().min(1).max(255).optional(),
      price: z.number().min(0).optional(),
      currency: z.string().min(3).max(3).optional(),
      bedrooms: z.number().min(0).optional(),
      bathrooms: z.number().min(0).optional(),
    }),
  }),
  async (req: Request, res: Response) => {
    logger.info(`Updating property ${req.params.id} by user ${req.jwtPayload?.ownerId}`);

    try {
      const property = await propertyService.update(req.params.id, req.body);

      logger.debug('Property updated', property);
      logger.info(`Property ${property.id} updated by user ${req.jwtPayload?.ownerId}`);

      return res.status(200).json(property);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.message.includes('Unique constraint failed')
      ) {
        logger.error(error.message);
        return res.status(400).json({ message: 'The property with this name already exists' });
      }

      logger.fatal(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
);
