export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber: number;
}

export function calculateLineDiff(originalCode: string, fixedCode: string): DiffLine[] {
  const originalLines = originalCode.split("\n");
  const fixedLines = fixedCode.split("\n");
  
  const diff: DiffLine[] = [];
  let originalIndex = 0;
  let fixedIndex = 0;

  while (originalIndex < originalLines.length || fixedIndex < fixedLines.length) {
    const originalLine = originalIndex < originalLines.length ? originalLines[originalIndex] : null;
    const fixedLine = fixedIndex < fixedLines.length ? fixedLines[fixedIndex] : null;

    if (originalLine === fixedLine) {
      diff.push({
        type: "unchanged",
        content: fixedLine || "",
        lineNumber: fixedIndex + 1,
      });
      originalIndex++;
      fixedIndex++;
    } else if (originalLine !== null && fixedLine === null) {
      diff.push({
        type: "removed",
        content: originalLine,
        lineNumber: originalIndex + 1,
      });
      originalIndex++;
    } else if (originalLine === null && fixedLine !== null) {
      diff.push({
        type: "added",
        content: fixedLine,
        lineNumber: fixedIndex + 1,
      });
      fixedIndex++;
    } else {
      diff.push({
        type: "removed",
        content: originalLine || "",
        lineNumber: originalIndex + 1,
      });
      diff.push({
        type: "added",
        content: fixedLine || "",
        lineNumber: fixedIndex + 1,
      });
      originalIndex++;
      fixedIndex++;
    }
  }

  return diff;
}

export function calculateCharacterDiff(original: string, fixed: string): { type: "added" | "removed" | "unchanged"; text: string }[] {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < original.length || j < fixed.length) {
    if (i < original.length && j < fixed.length && original[i] === fixed[j]) {
      result.push({ type: "unchanged", text: original[i] });
      i++;
      j++;
    } else if (i < original.length) {
      result.push({ type: "removed", text: original[i] });
      i++;
    } else if (j < fixed.length) {
      result.push({ type: "added", text: fixed[j] });
      j++;
    }
  }

  return result;
}
