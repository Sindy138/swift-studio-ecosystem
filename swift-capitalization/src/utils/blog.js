import { marked } from "marked";
import DOMPurify from "dompurify";

const RAW_FILES = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, content: raw };
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return { data: {}, content: raw };
  const yamlStr = raw.slice(4, end);
  const content = raw.slice(end + 4).trimStart();
  const data = {};
  for (const line of yamlStr.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }
  return { data, content };
}

function renderMarkdown(content) {
  const html = marked.parse(content, { async: false });
  const sanitized = typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;
  return sanitized;
}

export function getAllPosts() {
  return Object.entries(RAW_FILES)
    .map(([, raw]) => {
      const { data } = parseFrontmatter(raw);
      return {
        slug: data.slug || "",
        title: data.title || "",
        category: data.category || "General",
        date: data.date || "",
        excerpt: data.excerpt || "",
        readTime: Number(data.readTime) || 5,
        author: data.author || "Swift Studio",
      };
    })
    .filter((post) => post.slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  for (const [, raw] of Object.entries(RAW_FILES)) {
    const { data, content } = parseFrontmatter(raw);
    if (data.slug === slug) {
      return {
        slug: data.slug,
        title: data.title || "",
        category: data.category || "General",
        date: data.date || "",
        excerpt: data.excerpt || "",
        readTime: Number(data.readTime) || 5,
        author: data.author || "Swift Studio",
        html: renderMarkdown(content),
      };
    }
  }
  return null;
}

export const CATEGORY_COLORS = {
  Estrategia: "#ff7da2",
  Visual: "#ffae8e",
  Automate: "#aa73fa",
};

export const CATEGORIES = ["Todos", "Estrategia", "Visual", "Automate"];

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
