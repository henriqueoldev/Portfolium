import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/**
 * Single source of truth for project ordering: newest first,
 * with untitled dates last and titles used as a stable tie breaker.
 */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const dateDiff =
      (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0);
    return dateDiff !== 0 ? dateDiff : a.data.title.localeCompare(b.data.title);
  });
}

export async function getSortedProjects(): Promise<Project[]> {
  return sortProjects(await getCollection("projects"));
}
