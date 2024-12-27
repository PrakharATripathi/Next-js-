import {z} from 'zod';

export const messageSchema = z.object({
   constent:z.string().min(10, {message:'content must be at least 10 characters'}).max(300,{message:'content must no longer at  300 characters'})
})