"use client";

import { useState } from "react";

type InterviewResponse = {
  session_id: string;
  mode: string;
  question: string;
};

type AnswerResponse = {
  feedback: string;
  next_question: string;
};

export default function Home() {
  const [mode, setMode] = useState("Technical");
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");

  const modes = ["Technical", "Research", "HR"];

  async function startInterview() {
    setLoading(true);
    setError("");
    setFeedback("");
    setAnswer("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/interview/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data: InterviewResponse = await response.json();

      setQuestion(data.question);
      setSessionId(data.session_id);
      setStarted(true);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the interview engine. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/interview/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            mode,
            answer,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data: AnswerResponse = await response.json();

      setFeedback(data.feedback);
      setQuestion(data.next_question);
      setAnswer("");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to submit your answer. Please check that the backend is running."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">

        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-[0.2em]">
              INTERVIEW<span className="text-cyan-400">AI</span>
            </h1>

            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/40">
              Personal Interview Intelligence
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            System Online
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center">

          {!started && (
            <>
              <div className="relative mb-12 flex h-56 w-56 items-center justify-center">
                <div className="absolute h-56 w-56 animate-pulse rounded-full border border-cyan-400/20" />
                <div className="absolute h-44 w-44 rounded-full border border-cyan-400/30" />
                <div className="absolute h-32 w-32 rounded-full border border-cyan-400/40" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,0.35)]">
                  <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,1)]" />
                </div>
              </div>

              <p className="mb-3 text-xs uppercase tracking-[0.4em] text-cyan-400">
                AI Interview Core
              </p>

              <h2 className="text-center text-4xl font-semibold md:text-5xl">
                Your personal
                <span className="block text-white/50">
                  interview coach.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-center leading-7 text-white/50">
                Practise technical, research, PhD and behavioural interviews
                through realistic conversations.
              </p>
            </>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {modes.map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                disabled={started}
                className={`rounded-full border px-6 py-2.5 text-sm transition ${
                  mode === item
                    ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white"
                } disabled:cursor-not-allowed`}
              >
                {item}
              </button>
            ))}
          </div>

          {!started && (
            <button
              onClick={startInterview}
              disabled={loading}
              className="mt-10 rounded-full border border-cyan-300/50 bg-cyan-400/10 px-10 py-4 font-medium text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.12)] transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          )}

          {started && (
            <div className="mt-10 w-full max-w-3xl">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                    {mode} Interview
                  </p>

                  <p className="text-xs text-white/30">
                    Live Session
                  </p>
                </div>

                <p className="mt-6 text-2xl leading-9 text-white/90">
                  {question}
                </p>

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="mt-8 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white outline-none placeholder:text-white/20 focus:border-cyan-400/40"
                />

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={submitAnswer}
                    disabled={submitting}
                    className="rounded-full border border-cyan-300/50 bg-cyan-400/10 px-8 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Evaluating..." : "Submit Answer"}
                  </button>
                </div>
              </div>

              {feedback && (
                <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                    Interview Feedback
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {feedback}
                  </p>
                </div>
              )}

            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-6 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

        </section>

        <footer className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/30">
          <span>INTERVIEW AI v0.1.0</span>
          <span>Local-first architecture</span>
        </footer>

      </div>
    </main>
  );
}