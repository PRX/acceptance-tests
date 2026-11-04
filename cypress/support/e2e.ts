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

// HACK Turbo 8.0.23 aborts a turbo-frame's request when the frame is removed.
// If that lands while the body is being read, the rejection goes unhandled.
// Ignore AbortErrors when Turbo made the last abort() call.
//
// To check whether a Turbo version still has the bug, test it outside Cypress
// (Cypress's proxy buffers HTML responses, so the body is never mid-read):
//   1. Serve a page that loads that version's turbo.js and contains
//      <turbo-frame id="f" src="/slow"></turbo-frame>
//   2. Have /slow send its headers and part of the body right away, then hold
//      the rest for a few seconds
//   3. In Chrome, add an "unhandledrejection" listener, then remove the frame
//      while /slow is still sending
//
// Save a handle to the stack
let lastAbortStack = "";

// Use the window:before:load to swizzle the abort function.
Cypress.on("window:before:load", (win) => {
  const { abort } = win.AbortController.prototype;
  // eslint-disable-next-line no-param-reassign
  win.AbortController.prototype.abort = function recordAbort(...args) {
    // use `win.Error` to grab the whole stack (Error from this window forces chrome to sanitize it)
    lastAbortStack = new win.Error().stack ?? "";
    // finally call the original
    return abort.apply(this, args);
  };
});

// Now if we are in an AbortError and the stack trace originates in Turbo, ignore.
Cypress.on(
  "uncaught:exception",
  (err) => !(err.name === "AbortError" && /\/turbo[-.]/.test(lastAbortStack)),
);
