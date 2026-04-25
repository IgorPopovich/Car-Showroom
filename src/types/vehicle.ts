/** Product shape from DummyJSON used as a vehicle in the UI. */
export interface Vehicle {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
  category?: string
  thumbnail: string
  images?: string[]
}

export interface DummyJsonProductsListResponse {
  products?: Vehicle[]
  total?: number
  skip?: number
  limit?: number
}
