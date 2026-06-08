export interface CreateUserDto {
  email: string;
  firstName: string;
  age: number;

  city?: string;
  bio?: string;

  lookingFor?: string;

  minAge?: number;
  maxAge?: number;
}