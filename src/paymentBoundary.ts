export const MAX_DEMO_AMOUNT_MINOR = 99_999_999;

export type LedgerPosting = {
  paymentId: string;
  requestKey: string;
  amountMinor: number;
  debitMinor: number;
  creditMinor: number;
};

export type BoundaryResult = {
  kind: "committed" | "response-lost" | "replayed" | "mismatch" | "invalid";
  requestKey: string;
  amountMinor: number | null;
  paymentId?: string;
};

export type BoundaryTrace = BoundaryResult & { attempt: number };

export type BoundaryState = {
  postings: readonly LedgerPosting[];
  attempts: number;
  result: BoundaryResult | null;
  trace: readonly BoundaryTrace[];
};

export type BoundaryAction =
  | { type: "reset" }
  | {
      type: "request";
      requestKey: string;
      amountMinor: number | null;
      loseResponse?: boolean;
    };

export function initialBoundaryState(): BoundaryState {
  return { postings: [], attempts: 0, result: null, trace: [] };
}

// Parse decimal text into integer minor units without floating-point rounding.
export function parseDemoAmount(value: string): number | null {
  const match = /^(\d{1,6})(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) return null;
  const amount =
    Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
  return amount > 0 && amount <= MAX_DEMO_AMOUNT_MINOR ? amount : null;
}

export function formatDemoAmount(amountMinor: number): string {
  return `${Math.floor(amountMinor / 100).toLocaleString("en-US")}.${String(amountMinor % 100).padStart(2, "0")}`;
}

// A synchronous, in-memory teaching model. Database transactions, concurrent
// workers and durable storage are outside this model's scope.
export function paymentBoundaryReducer(
  state: BoundaryState,
  action: BoundaryAction,
): BoundaryState {
  if (action.type === "reset") return initialBoundaryState();

  const { requestKey, amountMinor } = action;
  const attempts = state.attempts + 1;
  let postings = state.postings;
  let result: BoundaryResult;

  if (
    !requestKey.trim() ||
    amountMinor === null ||
    !Number.isSafeInteger(amountMinor) ||
    amountMinor <= 0 ||
    amountMinor > MAX_DEMO_AMOUNT_MINOR
  ) {
    result = { kind: "invalid", requestKey, amountMinor: null };
  } else {
    const previous = state.postings.find(
      (posting) => posting.requestKey === requestKey,
    );
    if (previous) {
      result = {
        kind: previous.amountMinor === amountMinor ? "replayed" : "mismatch",
        requestKey,
        amountMinor,
        paymentId: previous.paymentId,
      };
    } else {
      const paymentId = `demo-pay-${String(state.postings.length + 1).padStart(3, "0")}`;
      postings = [
        ...state.postings,
        {
          paymentId,
          requestKey,
          amountMinor,
          debitMinor: -amountMinor,
          creditMinor: amountMinor,
        },
      ];
      result = {
        kind: action.loseResponse ? "response-lost" : "committed",
        requestKey,
        amountMinor,
        paymentId,
      };
    }
  }

  return {
    postings,
    attempts,
    result,
    trace: [...state.trace, { ...result, attempt: attempts }].slice(-5),
  };
}
