export interface Restaurant {
    _id?: string;
    name: string;
    address: {
        street: string,
        houseNumber: number,
        city: string,
        zipCode: string
    };
};
