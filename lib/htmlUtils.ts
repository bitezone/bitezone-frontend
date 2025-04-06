import * as he from "he";

// Decoding function
export function decodeHtmlEntities(input: string): string {
  if (typeof window !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    return textarea.value;
  } else {
    return he.decode(input);
  }
}
