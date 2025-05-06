export interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  owner: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}