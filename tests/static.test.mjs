import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { availableChapters, getChapter } from "../src/content/chapters.js";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the no-script fallback lists exactly the open chapters", () => {
  const list = read("index.html").match(/<ol>([\s\S]*?)<\/ol>/)?.[1] ?? "";
  const titles = [...list.matchAll(/<li>(.*?)<\/li>/g)].map((match) => match[1].trim());
  assert.deepEqual(
    titles,
    availableChapters.map((chapter) => chapter.title),
  );
});

test("app shortcuts in the manifest point at open chapters", () => {
  const { shortcuts = [] } = JSON.parse(read("public/site.webmanifest"));
  for (const shortcut of shortcuts) {
    const id = shortcut.url.split("#baca/")[1];
    assert.equal(getChapter(id)?.status, "available", shortcut.url);
  }
});
