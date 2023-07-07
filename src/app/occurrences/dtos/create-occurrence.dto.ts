export interface CreateOccurrenceDto {
  name: string;
  content: string;
  kind: "session" | "relevant-fact";
  files?: string[];
}
