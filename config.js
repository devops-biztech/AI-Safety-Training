/* ------------------------------------------------------------------
   Deployment settings. Edit this file, not app.js.

   submitUrl   Where each finished attempt is sent, as a JSON POST.
               Leave it empty until a collection point exists: the
               training still runs, and the pass stub tells the learner
               their record was not sent. The page may be opened from
               disk (origin "null"), so the endpoint has to allow CORS.
   timeoutMs   How long to wait for the endpoint before calling the
               send failed and offering a retry.
   ------------------------------------------------------------------ */

var QUIZ_CONFIG = {
  submitUrl: "",
  timeoutMs: 10000,
};
