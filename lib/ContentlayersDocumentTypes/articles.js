import { defineDocumentType } from "contentlayer/source-files";
import { abstractDocumentFrontMatter } from "./AbstractFrontMatter";

export const Articles = defineDocumentType(() => ({
  name: "Articles",
  filePathPattern: `articles/*.mdx`,
  contentType: "mdx",
  fields: { ...abstractDocumentFrontMatter },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath,
    },
    wordCount: {
      type: "number",
      resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
    category: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").shift(),
    },
  },
}));