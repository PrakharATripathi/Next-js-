import {z} from 'zod'

export const usernameValidation = z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must not exceed 20 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and hyphens')
        .nonempty('Username cannot be empty')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:'Invalid email address'}),
    password: z.string().min(8, {message:'Password must be at least 8 characters long'}).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message:'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
})