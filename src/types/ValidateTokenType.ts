export type ValidateTokenResponseType = 
  | { isValid: true; id: number; email: string }
  | { isValid: false }
