type Property = {
  name: string;
};

export interface PropertyService {
  list: () => Promise<Property[]>;
  create: (property: Property) => Promise<Property>;
}

export const propertyService: PropertyService = {
  list: async () => {
    return [];
  },

  create: async (property: Property) => {
    return property;
  },
};
