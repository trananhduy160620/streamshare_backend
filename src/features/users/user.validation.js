import { z } from "zod";

export const registerSchema = z.object({
    displayName: z.string().min(5, "Display Name must be as least 5 chars"),
    username: z.string().min(5, "Username must be at least 5 chars."),
    password: z.string().min(8, "Password must be at least 8 chars."),
});
