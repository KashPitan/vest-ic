import { z } from "zod";

export type JSONContentSchema = z.infer<typeof JSONContentSchema>;

export const JSONContentSchema = z
  .object({
    type: z.string().optional(),
    attrs: z.record(z.string(), z.any()).optional(),
    content: z
      .array(
        z.lazy((): z.ZodTypeAny => {
          return JSONContentSchema;
        })
      )
      .optional(),
    marks: z
      .array(
        z
          .object({
            type: z.string(),
            attrs: z.record(z.string(), z.any()).optional(),
          })
          .catchall(z.any())
      )
      .optional(),
    text: z.string().optional(),
  })
  .catchall(z.any());
