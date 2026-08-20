"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const MAX_CHARACTERS = 6_000;

const resultSections = [
  {
    title: "Evidence Found",
    description: "Requirements supported by details in the candidate profile.",
    accent: "bg-emerald-500",
  },
  {
    title: "Missing Evidence",
    description: "Requirements that are not demonstrated in the profile yet.",
    accent: "bg-amber-500",
  },
  {
    title: "Needs Human Review",
    description: "Information that is ambiguous or needs context from a person.",
    accent: "bg-sky-500",
  },
  {
    title: "Data We Ignore",
    description: "Sensitive personal details that must never affect the analysis.",
    accent: "bg-violet-500",
  },
];

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [candidateProfile, setCandidateProfile] = useState("");
  const [touched, setTouched] = useState({
    jobDescription: false,
    candidateProfile: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const jobDescriptionError = jobDescription.trim()
    ? ""
    : "Enter a job description before analyzing role fit.";
  const candidateProfileError = candidateProfile.trim()
    ? ""
    : "Enter a candidate profile before analyzing role fit.";
  const isFormValid = !jobDescriptionError && !candidateProfileError;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ jobDescription: true, candidateProfile: true });

    if (!isFormValid || isLoading) {
      return;
    }

    // This state is ready to wrap the analysis request in a later commit.
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 800);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <a className="text-xl font-bold tracking-tight" href="#top">
            Role<span className="text-indigo-600">Lens</span>
          </a>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Evidence, not a score
          </span>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Transparent job comparison
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            See the evidence behind a job match.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Compare a job description with a candidate profile. RoleLens shows
            what is supported, what is missing, and what needs a person&apos;s
            judgment—without ranking the candidate.
          </p>
        </section>

        <form
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
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
                className={`mt-3 min-h-64 w-full resize-y rounded-2xl border bg-slate-50 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                  touched.jobDescription && jobDescriptionError
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
                id="job-description"
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
                className={`mt-3 min-h-64 w-full resize-y rounded-2xl border bg-slate-50 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                  touched.candidateProfile && candidateProfileError
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
                id="candidate-profile"
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
              className="shrink-0 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
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
        </form>

        <section className="mt-12" aria-labelledby="results-heading">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-indigo-600">How results appear</p>
              <h2 id="results-heading" className="mt-1 text-2xl font-bold tracking-tight">
                A structured explanation
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {resultSections.map((section) => (
              <article
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                key={section.title}
              >
                <div className={`h-1.5 ${section.accent}`} />
                <div className="p-5">
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {section.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="mt-10 rounded-2xl bg-slate-900 px-6 py-5 text-slate-100 sm:flex sm:items-center sm:gap-4">
          <span aria-hidden="true" className="text-xl">✦</span>
          <p className="mt-2 text-sm leading-6 sm:mt-0">
            RoleLens explains evidence. It does not decide whether a person
            deserves the job.
          </p>
        </aside>
      </div>
    </main>
  );
}
