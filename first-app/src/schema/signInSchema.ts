import {z} from 'zod';

export const signInSchema = z.object({
   idntifiier:z.string(),
   password: z.string(), 
})