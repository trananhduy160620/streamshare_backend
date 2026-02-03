import { z } from "zod";

const createMediaSchema = z.object({
    title: z.string().nonempty("Title must be not empty."),
    description: z.string().nonempty("Description must be not empty."),
    url: z
        .string()
        .regex(
            /^https?:\/\/[\w.-]+\.[a-z]{2,}.*$/,
            "URL must be started by valid http:// or https://.",
        ),
});

const toggleHideMediaSchema = z.object({
    mediaId: z.coerce.number().positive("Media ID must be a positive number."),
});

export { createMediaSchema, toggleHideMediaSchema };
