export const ComponentTypeEnum = {
  Text: 14,
  List: 15,
  Form: 16,
  Carousel: 17
} as const

export type ComponentTypeEnum = (typeof ComponentTypeEnum)[keyof typeof ComponentTypeEnum]
