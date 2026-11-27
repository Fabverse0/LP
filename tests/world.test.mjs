import assert from "node:assert/strict";
import { test } from "node:test";
import { chapters } from "../src/content/chapters.js";
import { waypoints } from "../src/content/world.js";

test("the journey has one stop per chapter, in order", () => {
  assert.deepEqual(
    waypoints.map((stop) => stop.chapter),
    chapters.map((chapter) => chapter.number),
  );
});

test("each stop carries its chapter's title and release state", () => {
  waypoints.forEach((stop, index) => {
    assert.equal(stop.title, chapters[index].title);
    assert.equal(stop.released, chapters[index].status === "available");
  });
});
