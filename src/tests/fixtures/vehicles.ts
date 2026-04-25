import type { Vehicle } from '../../types/vehicle'

export const vehicleAlpha: Vehicle = {
  id: 10,
  title: 'Alpha Sedan',
  description: 'Comfortable city car',
  price: 25000,
  brand: 'BMW',
  rating: 4.5,
  thumbnail: 'https://example.com/alpha.jpg',
  images: ['https://example.com/alpha.jpg'],
}

export const vehicleBeta: Vehicle = {
  id: 20,
  title: 'Beta SUV',
  description: 'Off-road capable',
  price: 45000,
  brand: 'Audi',
  rating: 4.8,
  thumbnail: 'https://example.com/beta.jpg',
}

export const vehicleNoBrand: Vehicle = {
  id: 30,
  title: 'Gamma',
  description: 'No brand field',
  price: 5000,
  thumbnail: 'https://example.com/gamma.jpg',
}
