import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterProjects, projects } from "./data.ts";

test("catalogue filtering combines category and normalized search, including stacks", () => {
  assert.equal(filterProjects(projects, "Payments", " FLUTTER ").length, 2);
  assert.equal(
    filterProjects(projects, "All work", "no-such-project").length,
    0,
  );
  assert.equal(
    filterProjects(projects, "All work", "").length,
    projects.length,
  );
  assert.equal(new Set(projects.map((item) => item.id)).size, projects.length);
  for (const item of projects) {
    assert.ok(item.challenge && item.contribution && item.boundary);
    assert.ok(item.flow.length === 4 && item.decisions.length > 0);
  }
});

test("gallery and résumé links point to actual local image and PDF files", () => {
  for (const item of projects.filter((project) => project.image)) {
    const bytes = readFileSync(
      new URL(`../public${item.image}`, import.meta.url),
    );
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    assert.ok(isJpeg || isPng, `${item.name}: expected a real local image`);
    assert.ok(
      item.imageCaption,
      `${item.name}: image provenance needs a caption`,
    );
  }
  const pdf = readFileSync(
    new URL("../public/downloads/Cyril_Emmanuel_Resume.pdf", import.meta.url),
  );
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
});
