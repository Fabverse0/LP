import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import {
  markChapterRead,
  readChapterIds,
  readLastChapterId,
  readScroll,
  rememberLastChapter,
  resetReading,
  saveScroll,
} from "../src/content/chapters.js";

const FIRST = "jalan-tanpa-tuan";
const SECOND = "sungai-yang-sama";

function installBrowserStub() {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    dispatchEvent: () => true,
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, init) {
      this.type = type;
      this.detail = init?.detail;
    }
  };
}

beforeEach(installBrowserStub);

test("the last chapter is remembered and only open chapters count", () => {
  assert.equal(readLastChapterId(), null);
  rememberLastChapter(SECOND);
  assert.equal(readLastChapterId(), SECOND);
  rememberLastChapter("bulan-baru");
  assert.equal(readLastChapterId(), null);
});

test("finished chapters are listed once", () => {
  markChapterRead(FIRST);
  markChapterRead(FIRST);
  markChapterRead(SECOND);
  assert.deepEqual(readChapterIds(), [FIRST, SECOND]);
});

test("scroll position is clamped between zero and one", () => {
  assert.equal(readScroll(FIRST), 0);
  saveScroll(FIRST, 0.4);
  assert.equal(readScroll(FIRST), 0.4);
  saveScroll(FIRST, 7);
  assert.equal(readScroll(FIRST), 1);
});

test("resetReading clears the trail, the finished list and the positions", () => {
  rememberLastChapter(FIRST);
  markChapterRead(FIRST);
  saveScroll(FIRST, 0.5);
  resetReading();
  assert.equal(readLastChapterId(), null);
  assert.deepEqual(readChapterIds(), []);
  assert.equal(readScroll(FIRST), 0);
});

test("broken stored data falls back to empty values", () => {
  window.localStorage.setItem("kage:read", "{not json");
  window.localStorage.setItem("kage:scroll", "{not json");
  assert.deepEqual(readChapterIds(), []);
  assert.equal(readScroll(FIRST), 0);
});
