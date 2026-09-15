import { useId, useReducer, useState, type FormEvent } from "react";
import {
  formatDemoAmount,
  initialBoundaryState,
  parseDemoAmount,
  paymentBoundaryReducer,
  type BoundaryResult,
} from "./paymentBoundary";
import "./paymentBoundary.css";

const DEMO_KEY = "checkout-demo-104";
const INITIAL_AMOUNT = "100.00";
const resultCopy: Record<
  BoundaryResult["kind"],
  { title: string; detail: string; trace: string }
> = {
  committed: {
    title: "Payment recorded",
    detail: "The ledger contains one balanced posting for this request.",
    trace: "New key → payment recorded → result delivered",
  },
  "response-lost": {
    title: "Saved. Response lost.",
    detail:
      "The server recorded the payment, but the caller received no result. Try the same request again.",
    trace: "New key → payment recorded → response lost",
  },
  replayed: {
    title: "Original result returned",
    detail:
      "The key and amount match. The saved result is returned and the ledger stays unchanged.",
    trace: "Same key + same amount → original result → no new posting",
  },
  mismatch: {
    title: "Amount mismatch rejected",
    detail:
      "This key belongs to a different amount. The request is rejected and the original payment stays intact.",
    trace: "Same key + changed amount → conflict → no new posting",
  },
  invalid: {
    title: "Check the amount",
    detail:
      "Enter an amount from 0.01 to 999,999.99, using at most two decimal places.",
    trace: "Invalid amount → rejected before the ledger",
  },
};

export default function PaymentBoundary({
  compact = false,
}: {
  compact?: boolean;
}) {
  const id = useId();
  const [state, dispatch] = useReducer(
    paymentBoundaryReducer,
    undefined,
    initialBoundaryState,
  );
  const [amount, setAmount] = useState(INITIAL_AMOUNT);
  const posting = state.postings[0];
  const result = state.result;
  const copy = result ? resultCopy[result.kind] : null;
  const parsedAmount = parseDemoAmount(amount);
  const invalid = result?.kind === "invalid" && parsedAmount === null;

  function request(amountText: string) {
    dispatch({
      type: "request",
      requestKey: DEMO_KEY,
      amountMinor: parseDemoAmount(amountText),
      loseResponse: true,
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    request(amount);
  }

  function replayOriginal() {
    if (!posting) return;
    const original = `${Math.floor(posting.amountMinor / 100)}.${String(posting.amountMinor % 100).padStart(2, "0")}`;
    setAmount(original);
    request(original);
  }

  function changeAmount() {
    if (!posting) return;
    // Keep the demonstration inside its valid range even at the input maximum.
    const changed =
      posting.amountMinor < 99_999_999
        ? posting.amountMinor + 1
        : posting.amountMinor - 1;
    const value = `${Math.floor(changed / 100)}.${String(changed % 100).padStart(2, "0")}`;
    setAmount(value);
    request(value);
  }

  function reset() {
    setAmount(INITIAL_AMOUNT);
    dispatch({ type: "reset" });
  }

  return (
    <section
      className={`payment-boundary${compact ? " payment-boundary--compact" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <header className="payment-boundary__heading">
        <div>
          <span className="payment-boundary__eyebrow">
            Interactive engineering demonstration
          </span>
          <h3 id={`${id}-title`}>A retry. One payment.</h3>
          <p>
            A payment can be saved while its response gets lost. See how a
            request key makes a retry safe.
          </p>
        </div>
        <span className="payment-boundary__local">Synthetic · In memory</span>
      </header>

      <form className="payment-boundary__form" onSubmit={submit} noValidate>
        <div className="payment-boundary__field">
          <label htmlFor={`${id}-key`}>
            Request key <span>identifies one intended payment</span>
          </label>
          <input
            id={`${id}-key`}
            value={DEMO_KEY}
            readOnly
            spellCheck={false}
          />
        </div>
        <div className="payment-boundary__field payment-boundary__amount">
          <label htmlFor={`${id}-amount`}>
            Amount <span>demo units</span>
          </label>
          <input
            id={`${id}-amount`}
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-decision` : undefined}
            autoComplete="off"
            maxLength={10}
          />
        </div>
        <button className="payment-boundary__send" type="submit">
          Send request <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="payment-boundary__actions">
        <button type="button" onClick={replayOriginal} disabled={!posting}>
          Retry original request
        </button>
        <button type="button" onClick={changeAmount} disabled={!posting}>
          Try a different amount
        </button>
        <button
          type="button"
          onClick={reset}
          className="payment-boundary__reset"
          disabled={state.attempts === 0}
        >
          Reset
        </button>
      </div>

      <div className="payment-boundary__stages">
        <section className="payment-boundary__stage" aria-label="Request phase">
          <div className="payment-boundary__step">
            <span>01</span> Request <b aria-hidden="true">→</b>
          </div>
          <strong>
            {result ? `Attempt ${state.attempts}` : "Ready to send"}
          </strong>
          <p>
            {result?.amountMinor != null
              ? `${formatDemoAmount(result.amountMinor)} demo units`
              : "Send the first request to begin."}
          </p>
          <code>{DEMO_KEY}</code>
        </section>
        <section
          className={`payment-boundary__stage payment-boundary__decision${result ? ` payment-boundary__decision--${result.kind}` : ""}`}
          aria-label="Decision phase"
        >
          <div className="payment-boundary__step">
            <span>02</span> Decision <b aria-hidden="true">→</b>
          </div>
          <strong>{copy?.title ?? "Check key + amount"}</strong>
          <p id={`${id}-decision`}>
            {copy?.detail ??
              "A saved request can return its original result. A changed amount must use a new key."}
          </p>
          {result?.kind === "replayed" || result?.kind === "committed" ? (
            <code>Result: {result.paymentId}</code>
          ) : null}
        </section>
        <section className="payment-boundary__stage" aria-label="Ledger phase">
          <div className="payment-boundary__step">
            <span>03</span> Ledger
          </div>
          <strong className="payment-boundary__count">
            {state.postings.length}
            <small>
              balanced posting{state.postings.length === 1 ? "" : "s"}
            </small>
          </strong>
          {posting ? (
            <>
              <code>{posting.paymentId}</code>
              <dl className="payment-boundary__entries">
                <div>
                  <dt>Debit</dt>
                  <dd>−{formatDemoAmount(posting.amountMinor)}</dd>
                </div>
                <div>
                  <dt>Credit</dt>
                  <dd>+{formatDemoAmount(posting.amountMinor)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p>Nothing recorded yet.</p>
          )}
        </section>
      </div>

      <div className="payment-boundary__trace">
        <div className="payment-boundary__trace-heading">
          <h4>Request trace</h4>
          <span>Latest 5 attempts</span>
        </div>
        {state.trace.length ? (
          <ol>
            {state.trace.map((entry) => (
              <li key={entry.attempt}>
                <span className="payment-boundary__attempt">
                  {String(entry.attempt).padStart(2, "0")}
                </span>
                <span>{resultCopy[entry.kind].trace}</span>
                <span
                  className={`payment-boundary__trace-status payment-boundary__trace-status--${entry.kind}`}
                >
                  {entry.kind === "response-lost"
                    ? "Response lost"
                    : entry.kind === "replayed"
                      ? "Replayed"
                      : entry.kind === "committed"
                        ? "Recorded"
                        : "Rejected"}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="payment-boundary__trace-empty">
            Your requests will appear here.
          </p>
        )}
      </div>
      <p className="payment-boundary__caption">
        Standalone model of a payment-engineering decision. Synthetic data, no
        external requests. Reset clears this session. Production systems also
        need durable storage and concurrency controls.
      </p>
      <p
        className="payment-boundary__announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {copy
          ? `Attempt ${state.attempts}. ${copy.title} ${state.postings.length} balanced ledger posting${state.postings.length === 1 ? "" : "s"}.`
          : "Demonstration reset. No ledger postings."}
      </p>
    </section>
  );
}
