export interface Comment {
  id: string
  text: string
  author: string
  createdAt: number
}

export type CommentsByVehicleId = Record<string, Comment[]>
