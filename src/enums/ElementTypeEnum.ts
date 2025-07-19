export const ElementTypeEnum = {
  Alert: 7,
  Button: 8,
  Icon: 9,
  Input: 10,
  Link: 11,
  Text: 12,
  Image: 13,
  File: 14,
  Line: 15
} as const

export type ElementTypeEnum = (typeof ElementTypeEnum)[keyof typeof ElementTypeEnum]
