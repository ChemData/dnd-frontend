import { z } from "zod";

const CharacterSheetSchema = z.object({
    name: z.string(),
    level: z.number(),
    race: z.string().optional(),
    class: z.string().optional()
})

export type CharacterSheet = z.infer<typeof CharacterSheetSchema>;

