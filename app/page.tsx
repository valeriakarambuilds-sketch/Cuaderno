"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { roleAnalysisSchema } from "@/lib/role-analysis";
import type { RoleAnalysis } from "@/lib/role-analysis";

const MAX_CHARACTERS = 6_000;

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [candidateProfile, setCandidateProfile] = useState("");
  const [touched, setTouched] = useState({
    jobDescription: false,
    candidateProfile: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RoleAnalysis | null>(null);
  const [requestError, setRequestError] = useState("");

  const jobDescriptionError = jobDescription.trim()
    ? ""
    : "Enter a job description before analyzing role fit.";
  const candidateProfileError = candidateProfile.trim()
    ? ""
    : "Enter a candidate profile before analyzing role fit.";
  const isFormValid = !jobDescriptionError && !candidateProfileError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ jobDescription: true, candidateProfile: true });

    if (!isFormValid || isLoading) {
      return;
    }

    setIsLoading(true);
    setRequestError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, candidateProfile }),
      });
      const responseBody: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const serverMessage =
          responseBody &&
          typeof responseBody === "object" &&
          "error" in responseBody &&
          typeof responseBody.error === "string"
            ? responseBody.error
            : null;
        const message =
          response.status === 429
            ? "RoleLens is receiving too many requests. Wait a moment and try again."
            : response.status >= 500
              ? serverMessage ??
                "RoleLens is temporarily unavailable. Your information was not saved. Please try again."
              : serverMessage ??
                "Check the job description and candidate profile, then try again.";
        throw new Error(message);
      }

      const result =
        responseBody && typeof responseBody === "object" && "analysis" in responseBody
          ? roleAnalysisSchema.safeParse(responseBody.analysis)
          : null;

      if (!result?.success) {
        throw new Error("RoleLens received an invalid response. Please try again.");
      }

      setAnalysis(result.data);
    } catch (error) {
      setRequestError(
        error instanceof TypeError
          ? "We couldn't connect to RoleLens. Check your internet connection and try again. Your information was not saved."
          : error instanceof Error
          ? error.message
          : "Role analysis could not be completed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <a className="text-xl font-bold tracking-tight" href="#top">
            Role<span className="text-indigo-600">Lens</span>
          </a>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Evidence, not a score
          </span>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Transparent job comparison
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            See the evidence behind a job match.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Compare a job description with a candidate profile. RoleLens shows
            what is supported, what is missing, and what needs a person&apos;s
            judgment—without ranking the candidate.
          </p>
        </section>

        <form
          aria-busy={isLoading}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-8"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Job Description
              </span>
              <span
                className="mt-1 block text-sm text-slate-500"
                id="job-description-help"
              >
                Paste the responsibilities and requirements for the role.
              </span>
              <textarea
                aria-describedby="job-description-help job-description-count job-description-error"
                aria-invalid={touched.jobDescription && Boolean(jobDescriptionError)}
                className={`mt-3 min-h-56 w-full resize-y rounded-2xl border bg-slate-50 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-wait disabled:bg-slate-100 disabled:text-slate-500 sm:min-h-64 ${
                  touched.jobDescription && jobDescriptionError
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
                id="job-description"
                disabled={isLoading}
                maxLength={MAX_CHARACTERS}
                onBlur={() =>
                  setTouched((current) => ({ ...current, jobDescription: true }))
                }
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
                required
                value={jobDescription}
              />
              <span className="mt-2 flex min-h-6 items-start justify-between gap-4 text-sm">
                <span className="text-rose-600" id="job-description-error" role="alert">
                  {touched.jobDescription ? jobDescriptionError : ""}
                </span>
                <span
                  className="shrink-0 tabular-nums text-slate-500"
                  id="job-description-count"
                >
                  {jobDescription.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
                </span>
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Candidate Profile
              </span>
              <span
                className="mt-1 block text-sm text-slate-500"
                id="candidate-profile-help"
              >
                Paste a resume or a summary of relevant experience.
              </span>
              <textarea
                aria-describedby="candidate-profile-help candidate-profile-count candidate-profile-error"
                aria-invalid={touched.candidateProfile && Boolean(candidateProfileError)}
                className={`mt-3 min-h-56 w-full resize-y rounded-2xl border bg-slate-50 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-wait disabled:bg-slate-100 disabled:text-slate-500 sm:min-h-64 ${
                  touched.candidateProfile && candidateProfileError
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
                id="candidate-profile"
                disabled={isLoading}
                maxLength={MAX_CHARACTERS}
                onBlur={() =>
                  setTouched((current) => ({ ...current, candidateProfile: true }))
                }
                onChange={(event) => setCandidateProfile(event.target.value)}
                placeholder="Paste the candidate profile here..."
                required
                value={candidateProfile}
              />
              <span className="mt-2 flex min-h-6 items-start justify-between gap-4 text-sm">
                <span className="text-rose-600" id="candidate-profile-error" role="alert">
                  {touched.candidateProfile ? candidateProfileError : ""}
                </span>
                <span
                  className="shrink-0 tabular-nums text-slate-500"
                  id="candidate-profile-count"
                >
                  {candidateProfile.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
                </span>
              </span>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Do not include real personal data in this demo. Sensitive details
              such as age, gender, race, disability, or marital status are not
              evidence of job suitability.
            </p>
            <button
              aria-describedby="analysis-status"
              className="w-full shrink-0 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-100 sm:w-auto"
              disabled={!isFormValid || isLoading}
              type="submit"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                  Analyzing…
                </span>
              ) : (
                "Analyze Role Fit"
              )}
            </button>
          </div>
          <p className="sr-only" id="analysis-status" aria-live="polite">
            {isLoading ? "Analysis is loading." : ""}
          </p>
          {isLoading ? (
            <p className="mt-4 text-center text-sm text-slate-600" aria-live="polite">
              Comparing the evidence now. This may take a moment.
            </p>
          ) : null}
          {requestError ? (
            <p
              className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert"
            >
              {requestError}
            </p>
          ) : null}
        </form>

        {analysis ? (
          <section className="mt-12" aria-labelledby="results-heading">
            <div>
              <p className="text-sm font-semibold text-indigo-600">Analysis complete</p>
              <h2 id="results-heading" className="mt-1 text-2xl font-bold tracking-tight">
                Structured analysis results
              </h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-1.5 bg-emerald-500" />
                <div className="p-5">
                  <h3 className="font-semibold">Evidence Found</h3>
                  {analysis.evidenceFound.length ? (
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                      {analysis.evidenceFound.map((item, index) => (
                        <li key={`${item.requirement}-${index}`}>
                          <span className="font-semibold text-slate-800">{item.requirement}:</span>{" "}
                          {item.evidence}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-500">No explicit evidence was found.</p>
                  )}
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-1.5 bg-amber-500" />
                <div className="p-5">
                  <h3 className="font-semibold">Missing Evidence</h3>
                  {analysis.missingEvidence.length ? (
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                      {analysis.missingEvidence.map((item, index) => (
                        <li key={`${item.requirement}-${index}`}>
                          <span className="font-semibold text-slate-800">{item.requirement}:</span>{" "}
                          {item.reason}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-500">No missing evidence was identified.</p>
                  )}
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-1.5 bg-sky-500" />
                <div className="p-5">
                  <h3 className="font-semibold">Needs Human Review</h3>
                  {analysis.humanReview.length ? (
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                      {analysis.humanReview.map((item, index) => (
                        <li key={`${item.item}-${index}`}>
                          <span className="font-semibold text-slate-800">{item.item}:</span>{" "}
                          {item.reason}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-500">No items require human review.</p>
                  )}
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-1.5 bg-violet-500" />
                <div className="p-5">
                  <h3 className="font-semibold">Data Intentionally Ignored</h3>
                  {analysis.ignoredData.length ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                      {analysis.ignoredData.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-500">No sensitive data was present.</p>
                  )}
                </div>
              </article>
            </div>

            <article className="mt-4 overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50 shadow-sm">
              <div className="p-5">
                <h3 className="font-semibold text-indigo-950">Next Best Action</h3>
                <p className="mt-2 text-sm leading-6 text-indigo-900">{analysis.nextAction}</p>
              </div>
            </article>
          </section>
        ) : null}

        <aside className="mt-10 rounded-2xl bg-slate-900 px-6 py-5 text-slate-100 sm:flex sm:items-center sm:gap-4">
          <span aria-hidden="true" className="text-xl">✦</span>
          <p className="mt-2 text-sm leading-6 sm:mt-0">
            RoleLens explains evidence. It does not decide whether a person
            deserves the job.
          </p>
        </aside>

        <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-6 text-slate-600">
          RoleLens provides information to support human decision-making. Final
          decisions should always include human judgment.
        </p>
      </div>
    </main>
  );
}
