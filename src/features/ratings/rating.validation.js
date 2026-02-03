import { z } from "zod";

const rateSchema = z.object({
    mediaId: z.coerce.number({
        required_error: "Media Id is required",
        invalid_type_error: "Media Id must be a number",
    }),
    value: z.coerce
        .number()
        .refine((v) => v === 1 || v === -1, {
            message: "Value must be 1 or -1",
        }),
});

export { rateSchema };
