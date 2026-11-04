// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands.ts";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Turbo 8.0.23 aborts a turbo-frame's request when the frame is removed. If
// that lands while the body is being read, the rejection goes unhandled. Ignore
// AbortErrors when Turbo made the last abort() call.
//
// TEMPORARY: affects Turbo 8.0.23 (turbo-rails 2.0.23). Remove this once
// Augury runs a Turbo that handles the rejection.
// The bug: FetchRequest#receive doesn't await requestSucceededWithResponse,
// and FrameController#loadResponse has no catch around reading the body.
//
// To check whether a Turbo version still has the bug, test it outside Cypress
// (Cypress's proxy buffers HTML responses, so the body is never mid-read):
//   1. Serve a page that loads that version's turbo.js and contains
//      <turbo-frame id="f" src="/slow"></turbo-frame>
//   2. Have /slow send its headers and part of the body right away, then hold
//      the rest for a few seconds
//   3. In Chrome, add an "unhandledrejection" listener, then remove the frame
//      while /slow is still sending
// An unhandled AbortError means the bug is still there. Turbo 8.0.12 doesn't
// abort on disconnect, so it never shows the error.
let lastAbortStack = "";

Cypress.on("window:before:load", (win) => {
  const { abort } = win.AbortController.prototype;
  // eslint-disable-next-line no-param-reassign
  win.AbortController.prototype.abort = function recordAbort(...args) {
    // app-realm Error: Augury is cross-origin to the spec, and V8 hides
    // cross-origin frames from a spec-realm stack. It leaves out any stack
    // frames running code from a different origin than the one creating the
    // Error.
    lastAbortStack = new win.Error().stack ?? "";
    return abort.apply(this, args);
  };
});

Cypress.on(
  "uncaught:exception",
  (err) => !(err.name === "AbortError" && /\/turbo[-.]/.test(lastAbortStack)),
);
