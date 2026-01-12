export interface PostType {
  id: number
  websiteId: number
  userId: number
  title: string
  text: string
  slug: string
  images: string[] | null
  main_image_index?: number
  status: 'published' | 'draft'
  publishedAt: string | null
  createdAt: string | { date: string }
  updatedAt: string
  deletedAt: string | null
}

export interface CreatePostData {
  website_id: number
  title: string
  text: string
  slug?: string
  images?: string[] | null
  main_image_index?: number
  status?: 'published' | 'draft'
}

export interface UpdatePostData {
  title?: string
  text?: string
  slug?: string
  images?: string[] | null
  main_image_index?: number
  status?: 'published' | 'draft'
}
