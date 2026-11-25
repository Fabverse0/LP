import assert from "node:assert/strict";
import { test } from "node:test";
import {
  availableChapters,
  chapters,
  getChapter,
  readingMinutes,
} from "../src/content/chapters.js";

test("chapter ids are unique and numbered in order", () => {
  const ids = chapters.map((chapter) => chapter.id);
  assert.equal(new Set(ids).size, ids.length);
  chapters.forEach((chapter, index) => assert.equal(chapter.number, index + 1));
});

test("open chapters have prose and upcoming ones do not", () => {
  for (const chapter of chapters) {
    if (chapter.status === "available") {
      assert.ok(chapter.paragraphs.length > 0, `${chapter.id} has no paragraphs`);
    } else {
      assert.equal(chapter.status, "soon");
      assert.equal(chapter.paragraphs.length, 0, `${chapter.id} should be empty`);
    }
  }
});

test("every chapter carries a title, intro and kanji", () => {
  for (const chapter of chapters) {
    assert.ok(chapter.title && chapter.intro && chapter.kanji, `${chapter.id} is incomplete`);
  }
});

test("availableChapters only lists open chapters", () => {
  assert.ok(availableChapters.length > 0);
  assert.ok(availableChapters.every((chapter) => chapter.status === "available"));
});

test("getChapter finds by id and returns nothing for unknown ids", () => {
  assert.equal(getChapter(chapters[0].id), chapters[0]);
  assert.equal(getChapter("tidak-ada"), undefined);
});

test("readingMinutes is at least one minute", () => {
  for (const chapter of chapters) assert.ok(readingMinutes(chapter) >= 1);
  assert.equal(readingMinutes({ title: "a", intro: "b", paragraphs: [] }), 1);
});
