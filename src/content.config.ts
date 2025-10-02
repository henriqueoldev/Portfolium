import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const projects = defineCollection({
    loader: glob({pattern: "**/*.md", base: "src/config/content"}),
    schema: z.object({
        title: z.string(),
        date: z.date().optional(),
        description: z.string(),
        imageUrl: z.optional(z.string()),
        languages: z.array(z.string()).optional()
    })
});

export const collections = { projects };