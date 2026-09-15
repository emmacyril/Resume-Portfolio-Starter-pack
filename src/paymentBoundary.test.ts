import test from "node:test";
import assert from "node:assert/strict";
import {
  initialBoundaryState,
  parseDemoAmount,
  paymentBoundaryReducer,
} from "./paymentBoundary.ts";

const request = {
  type: "request",
  requestKey: "demo-104",
  amountMinor: 10_000,
  loseResponse: true,
} as const;

test("lost response still records one balanced payment; retries return its original result", () => {
  const empty = initialBoundaryState();
  const committed = paymentBoundaryReducer(empty, request);
  assert.equal(committed.result?.kind, "response-lost");
  assert.equal(committed.postings.length, 1);
  assert.equal(
    committed.postings[0].debitMinor + committed.postings[0].creditMinor,
    0,
  );
  const originalId = committed.postings[0].paymentId;
  let replayed = committed;
  for (let retry = 0; retry < 3; retry++)
    replayed = paymentBoundaryReducer(replayed, request);
  assert.equal(replayed.result?.kind, "replayed");
  assert.equal(replayed.result?.paymentId, originalId);
  assert.equal(replayed.postings.length, 1);
  assert.strictEqual(replayed.postings, committed.postings);
  assert.equal(empty.postings.length, 0);
});

test("same key with a changed amount rejects the request and preserves the payment", () => {
  const committed = paymentBoundaryReducer(initialBoundaryState(), request);
  const mismatch = paymentBoundaryReducer(committed, {
    ...request,
    amountMinor: 10_001,
  });
  assert.equal(mismatch.result?.kind, "mismatch");
  assert.strictEqual(mismatch.postings, committed.postings);
  assert.equal(mismatch.postings[0].amountMinor, 10_000);
  const retry = paymentBoundaryReducer(mismatch, request);
  assert.equal(retry.result?.kind, "replayed");
  assert.equal(retry.result?.paymentId, committed.result?.paymentId);
});

test("reset clears postings, trace and result without mutating earlier state", () => {
  const committed = paymentBoundaryReducer(initialBoundaryState(), request);
  const reset = paymentBoundaryReducer(committed, { type: "reset" });
  assert.deepEqual(reset, initialBoundaryState());
  assert.equal(committed.postings.length, 1);
  assert.equal(
    paymentBoundaryReducer(reset, request).result?.kind,
    "response-lost",
  );
});

test("decimal parsing is exact and invalid amounts cannot change the ledger", () => {
  assert.equal(parseDemoAmount("100.01"), 10_001);
  assert.equal(parseDemoAmount("0.29"), 29);
  assert.equal(parseDemoAmount(" 12.3 "), 1_230);
  assert.equal(parseDemoAmount("999999.99"), 99_999_999);
  for (const value of [
    "",
    "0",
    "-1",
    "1.001",
    "1e3",
    "Infinity",
    "1000000",
    "abc",
  ]) {
    assert.equal(parseDemoAmount(value), null, value);
  }
  for (const amountMinor of [null, NaN, Infinity, 0, -1, 1.5, 100_000_000]) {
    const state = paymentBoundaryReducer(initialBoundaryState(), {
      ...request,
      amountMinor,
    });
    assert.equal(state.result?.kind, "invalid");
    assert.equal(state.postings.length, 0);
  }
});
