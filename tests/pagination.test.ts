import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { paginate } from "../lib/pagination";

describe("paginate", () => {
  it("calculates the number of pages", () => {
    const result = paginate(23, 1, 10);

    assert.equal(result.page, 1);
    assert.equal(result.size, 10);
    assert.equal(result.total, 23);
    assert.equal(result.totalPages, 3);
  });

  it("clamps a page beyond the last page", () => {
    const result = paginate(23, 99, 10);
    assert.equal(result.page, 3);
  });

  it("clamps a negative page to page 1", () => {
    const result = paginate(23, -1, 10);
    assert.equal(result.page, 1);
  });

  it("keeps page 1 when there are no results", () => {
    const result = paginate(0, 1, 10);

    assert.equal(result.page, 1);
    assert.equal(result.totalPages, 0);
  });

  it("uses size 10 when the requested size is unsupported", () => {
    const result = paginate(23, 1, 15);

    assert.equal(result.size, 10);
    assert.equal(result.totalPages, 3);
  });
});