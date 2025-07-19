import type { User } from './User'

export interface AuthenticateResponse {
  status: boolean;
  data: User;
}