import { string, object } from 'yup';

export const signInSchema = object({
  username: string().required(),
  password: string().required(),
});
