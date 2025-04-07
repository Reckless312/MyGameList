import {z} from "zod"

export const gameSchema = z.object({
    name: z.string().min(3, "Name must be a string with at least 3 characters"),
    description: z.string().min(10, "Description must be a string with at least 10 characters"),
    image: z.string().url("Invalid image url"),
    releaseDate: z.string().date("Release date must follow YYYY-MM-DD format"),
    price: z.number().nonnegative().max(99.99, "Price must be at most 99.99 ..."),
    tag: z.string().min(3, "Tag must be a string with at least 3 characters"),
})
