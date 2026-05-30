/**
 * ingestDocument.ts
 * ARIA pipeline — reads files from incoming_files/, extracts text, triggers analysis
 */

export async function ingestDocuments(projectId: string): Promise<{ text: string; files: string[] }> {
  const incomingPath = new URL(`../incoming_files/${projectId}/`, import.meta.url);
  const files: string[] = [];
  let combinedText = "";

  try {
    for await (const entry of Deno.readDir(incomingPath)) {
      if (entry.isFile) {
        files.push(entry.name);
        const filePath = new URL(`../incoming_files/${projectId}/${entry.name}`, import.meta.url);

        if (entry.name.endsWith(".txt") || entry.name.endsWith(".md")) {
          const text = await Deno.readTextFile(filePath);
          combinedText += `\n\n=== FILE: ${entry.name} ===\n${text}`;
        } else if (entry.name.endsWith(".pdf")) {
          // PDF extraction requires external tool — placeholder
          combinedText += `\n\n=== FILE: ${entry.name} ===\n[PDF file detected — extract text before ingestion]`;
        } else if (entry.name.endsWith(".json")) {
          const text = await Deno.readTextFile(filePath);
          combinedText += `\n\n=== FILE: ${entry.name} (JSON) ===\n${text}`;
        }
      }
    }
  } catch {
    console.warn(`[ingestDocument] No files found for project ${projectId} in incoming_files/`);
  }

  return { text: combinedText, files };
}
