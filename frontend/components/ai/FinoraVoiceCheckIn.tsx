"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";

type Question = {
  key: string;
  text: string;
};

type Props = {
  mode?: "new" | "daily";
  open?: boolean;
  onClose?: () => void;
  onComplete?: (answers: Record<string, string>) => void;
};

/* =========================================================
   QUESTIONS
========================================================= */

const NEW_QUESTIONS: Question[] = [
  {
    key: "monthlyIncome",
    text: "What's your usual monthly income?",
  },
  {
    key: "monthlyExpenses",
    text: "About how much do you spend each month?",
  },
  {
    key: "loans",
    text: "Do you currently have any loans or EMIs?",
  },
  {
    key: "goal",
    text: "What's your biggest financial goal right now?",
  },
  {
    key: "savings",
    text: "How much do you currently have saved?",
  },
  {
    key: "investments",
    text: "Do you currently invest any money?",
  },
  {
    key: "regularExpenses",
    text: "What are your biggest regular expenses?",
  },
  {
    key: "savingsGoal",
    text: "How much would you like to save each month?",
  },
];

const DAILY_QUESTIONS: Question[] = [
  {
    key: "income",
    text: "Did you earn any money today?",
  },
  {
    key: "expenses",
    text: "Did you spend any money today?",
  },
  {
    key: "bills",
    text: "Did you pay any bills or EMIs today?",
  },
  {
    key: "bonus",
    text: "Did you receive any bonus or extra income today?",
  },
  {
    key: "largeExpense",
    text: "Did you have any unusual or large expense today?",
  },
  {
    key: "goalUpdate",
    text: "Is there anything new you want to save for?",
  },
];

/* =========================================================
   BROWSER SPEECH TYPES
========================================================= */

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;

  start(): void;
  stop(): void;
  abort(): void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: { results: any }) => void) | null;
};

type RecognitionConstructor = new () => Recognition;

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function FinoraVoiceCheckIn({
  mode = "daily",
  open = true,
  onClose,
  onComplete,
}: Props) {
  const questions =
    mode === "new"
      ? NEW_QUESTIONS
      : DAILY_QUESTIONS;

  const [index, setIndex] = useState(0);

  const [text, setText] = useState("");

  const [listening, setListening] =
    useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [done, setDone] =
    useState(false);

  const recognition =
    useRef<Recognition | null>(null);

  const silenceTimer =
    useRef<number | null>(null);

  const currentText =
    useRef("");

  const finalText =
    useRef("");

  const processingRef =
    useRef(false);

  const manuallyStopping =
    useRef(false);

  const answersRef =
    useRef<Record<string, string>>({});

  const indexRef =
    useRef(0);

  const isMounted =
    useRef(true);

  /* =======================================================
     CLEAN SILENCE TIMER
  ======================================================= */

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimer.current !== null) {
      window.clearTimeout(
        silenceTimer.current
      );

      silenceTimer.current = null;
    }
  }, []);

  /* =======================================================
     SPEAK
  ======================================================= */

  const speak = useCallback(
    (message: string) => {
      if (
        typeof window === "undefined" ||
        !window.speechSynthesis
      ) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          message
        );

      utterance.rate = 0.95;
      utterance.pitch = 1;

      utterance.onstart = () => {
        if (isMounted.current) {
          setSpeaking(true);
        }
      };

      utterance.onend = () => {
        if (isMounted.current) {
          setSpeaking(false);
        }
      };

      utterance.onerror = () => {
        if (isMounted.current) {
          setSpeaking(false);
        }
      };

      window.speechSynthesis.speak(
        utterance
      );
    },
    []
  );

  /* =======================================================
     MOVE TO NEXT QUESTION
  ======================================================= */

  const processAnswer = useCallback(
    (answerText: string) => {
      const answer = answerText.trim();

      if (!answer || processingRef.current) {
        setProcessing(false);
        return;
      }

      const currentIndex = indexRef.current;
      const currentQuestion = questions[currentIndex];

      if (!currentQuestion) {
        setProcessing(false);
        return;
      }

      processingRef.current = true;
      clearSilenceTimer();

      const nextAnswers = {
        ...answersRef.current,
        [currentQuestion.key]: answer,
      };

      answersRef.current = nextAnswers;
      setAnswers(nextAnswers);
      setProcessing(true);
      setListening(false);

      try {
        recognition.current?.abort();
      } catch {
        // Ignore browser cleanup errors.
      }

      recognition.current = null;

      if (currentIndex === questions.length - 1) {
        window.setTimeout(() => {
          if (!isMounted.current) return;

          processingRef.current = false;
          setProcessing(false);
          setDone(true);
          onComplete?.(nextAnswers);
        }, 650);

        return;
      }

      const nextIndex = currentIndex + 1;
      indexRef.current = nextIndex;

      window.setTimeout(() => {
        if (!isMounted.current) return;

        processingRef.current = false;

        setIndex(nextIndex);
        setText("");
        currentText.current = "";
        finalText.current = "";
        setProcessing(false);
        setError("");

        window.setTimeout(() => {
          if (!isMounted.current) return;
          speak(questions[nextIndex].text);
        }, 350);
      }, 500);
    },
    [
      clearSilenceTimer,
      onComplete,
      questions,
      speak,
    ]
  );

  /* =======================================================
     AUTOMATIC SILENCE DETECTION
  ======================================================= */

  const scheduleSilenceCapture =
    useCallback(() => {
      clearSilenceTimer();

      silenceTimer.current = window.setTimeout(() => {
        if (
          !isMounted.current ||
          processingRef.current
        ) {
          return;
        }

        const answer =
          (finalText.current || currentText.current).trim();

        if (!answer) {
          setListening(false);
          setError(
            "I couldn't hear a clear answer. Tap the microphone and try again."
          );
          return;
        }

        processAnswer(answer);
      }, 2200);
    }, [
      clearSilenceTimer,
      processAnswer,
    ]);

  /* =======================================================
     START LISTENING
  ======================================================= */

  const startListening =
    useCallback(async () => {
      if (
        typeof window === "undefined" ||
        processingRef.current ||
        speaking
      ) {
        return;
      }

      const Constructor =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!Constructor) {
        setError(
          "Voice recognition is not supported in this browser. Please use the latest Chrome or Edge."
        );
        return;
      }

      /*
       * Explicitly request microphone permission first.
       * This makes the deployed HTTPS version much more
       * reliable and gives the user a useful error when
       * the browser blocks the microphone.
       */
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream =
            await navigator.mediaDevices.getUserMedia({
              audio: true,
            });

          stream
            .getTracks()
            .forEach((track) => track.stop());
        } catch (error) {
          console.error(
            "Finora microphone permission error:",
            error
          );

          setError(
            "Microphone access is blocked. Allow microphone permission for Finora, then try again."
          );
          return;
        }
      }

      clearSilenceTimer();

      try {
        recognition.current?.abort();
      } catch {
        // Ignore old recognition cleanup errors.
      }

      const r = new Constructor();

      r.continuous = true;
      r.interimResults = true;
      r.lang =
        navigator.language?.toLowerCase() === "en-us"
          ? "en-US"
          : "en-IN";

      manuallyStopping.current = false;
      currentText.current = "";
      finalText.current = "";

      r.onstart = () => {
        if (!isMounted.current) return;

        setListening(true);
        setError("");
      };

      r.onresult = (event) => {
        if (!isMounted.current) return;

        let interim = "";
        let finals = "";

        const startIndex = 0;

        for (
          let i = startIndex;
          i < event.results.length;
          i++
        ) {
          const result = event.results[i];

          const transcript =
            result?.[0]?.transcript?.trim() || "";

          if (!transcript) continue;

          if (result.isFinal) {
            finals += `${transcript} `;
          } else {
            interim += `${transcript} `;
          }
        }

        /*
         * Only append FINAL results to finalText.
         * The previous implementation concatenated every
         * result, including interim results, which can cause
         * duplicated transcripts.
         */
        if (finals) {
          finalText.current =
            `${finalText.current} ${finals}`
              .replace(/\s+/g, " ")
              .trim();
        }

        const combined =
          `${finalText.current} ${interim}`
            .replace(/\s+/g, " ")
            .trim();

        if (combined) {
          currentText.current = combined;
          setText(combined);
          setError("");
          scheduleSilenceCapture();
        }
      };

      r.onerror = (event) => {
        if (!isMounted.current) return;

        clearSilenceTimer();

        const code = event.error || "unknown";

        console.warn(
          "Finora SpeechRecognition error:",
          code
        );

        if (code === "aborted") {
          setListening(false);
          return;
        }

        if (
          code === "not-allowed" ||
          code === "service-not-allowed"
        ) {
          setListening(false);
          setError(
            "Microphone permission was denied. Allow microphone access in your browser settings and try again."
          );
          return;
        }

        if (code === "audio-capture") {
          setListening(false);
          setError(
            "Your microphone could not be accessed. Check that your microphone is connected and not being used by another app."
          );
          return;
        }

        if (code === "network") {
          setListening(false);
          setError(
            "Speech recognition needs an internet connection. Please check your connection and try again."
          );
          return;
        }

        if (code === "no-speech") {
          const answer =
            (
              finalText.current ||
              currentText.current
            ).trim();

          if (answer) {
            setListening(false);
            processAnswer(answer);
            return;
          }

          setListening(false);
          setError(
            "I didn't hear any speech. Tap the microphone and speak after it says Listening."
          );
          return;
        }

        setListening(false);
        setError(
          "I couldn't access speech recognition. Please try again."
        );
      };

      r.onend = () => {
        if (!isMounted.current) return;

        clearSilenceTimer();

        const answer =
          (
            finalText.current ||
            currentText.current
          ).trim();

        /*
         * Chrome can end recognition automatically.
         * If words were captured, don't throw them away.
         */
        if (
          answer &&
          !processingRef.current &&
          !manuallyStopping.current
        ) {
          setListening(false);
          processAnswer(answer);
          return;
        }

        setListening(false);

        if (
          !answer &&
          !manuallyStopping.current &&
          !processingRef.current
        ) {
          setError(
            "I didn't hear any speech. Tap the microphone and speak clearly."
          );
        }
      };

      recognition.current = r;

      setText("");
      currentText.current = "";
      finalText.current = "";
      setError("");

      try {
        r.start();
      } catch (error) {
        console.error(
          "Finora recognition start error:",
          error
        );

        recognition.current = null;
        setListening(false);
        setError(
          "Unable to start voice recognition. Please tap the microphone again."
        );
      }
    }, [
      clearSilenceTimer,
      processAnswer,
      scheduleSilenceCapture,
      speaking,
    ]);

  const stopListening =
    useCallback(() => {
      manuallyStopping.current = true;
      clearSilenceTimer();

      const answer =
        (
          finalText.current ||
          currentText.current
        ).trim();

      try {
        recognition.current?.stop();
      } catch {
        // Ignore browser cleanup errors.
      }

      setListening(false);

      /*
       * If the user manually stops after speaking,
       * save the captured answer immediately.
       */
      if (
        answer &&
        !processingRef.current
      ) {
        processAnswer(answer);
      }
    }, [
      clearSilenceTimer,
      processAnswer,
    ]);

  /* =======================================================
     START QUESTION
  ======================================================= */

  useEffect(() => {
    if (
      !open ||
      done ||
      questions.length === 0
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        speak(
          questions[index].text
        );
      }, 500);

    return () =>
      window.clearTimeout(timer);
  }, [
    open,
    done,
    index,
    questions,
    speak,
  ]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;

      clearSilenceTimer();

      recognition.current?.abort();
      recognition.current = null;
      processingRef.current = false;

      if (
        typeof window !==
        "undefined"
      ){
        window.speechSynthesis?.cancel();
      }
    };
  }, [
    clearSilenceTimer,
  ]);

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {
    clearSilenceTimer();

    recognition.current?.abort();
    recognition.current = null;
    processingRef.current = false;

    if (
      typeof window !==
      "undefined"
    ){
      window.speechSynthesis?.cancel();
    }

    setListening(false);
    setSpeaking(false);

    onClose?.();
  };

  if (!open) {
    return null;
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        fixed
        inset-0
        z-[80]
        flex
        items-end
        justify-center
        bg-gray-950/35
        p-4
        backdrop-blur-md
        sm:items-center
      "
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Finora AI voice check-in"
        className="
          relative
          w-full
          max-w-[460px]
          overflow-hidden
          rounded-[32px]
          border
          border-white/80
          bg-white/95
          p-5
          shadow-[0_35px_120px_rgba(30,20,60,0.25)]
          backdrop-blur-2xl
          sm:p-6
        "
      >
        {/* Ambient glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-purple-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-28
            -left-20
            h-56
            w-56
            rounded-full
            bg-indigo-500/[0.06]
            blur-3xl
          "
        />

        <div className="relative">
          {/* HEADER */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  relative
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-purple-600
                  via-violet-600
                  to-indigo-600
                  text-white
                  shadow-lg
                  shadow-purple-500/25
                "
              >
                <Sparkles size={21} />

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-3.5
                    w-3.5
                    rounded-full
                    border-2
                    border-white
                    bg-emerald-400
                  "
                />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-purple-500">
                  Finora AI
                </p>

                <h2 className="text-lg font-black tracking-tight text-gray-950">
                  {mode === "new"
                    ? "Let's set up your finances"
                    : "Your daily check-in"}
                </h2>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Voice-powered financial assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close voice check-in"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-gray-400
                transition-all
                hover:bg-gray-100
                hover:text-gray-700
              "
            >
              <X size={18} />
            </button>
          </div>

          {/* QUESTION CARD */}

          {!done ? (
            <>
              <div
                className="
                  mt-6
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-purple-100
                  bg-gradient-to-br
                  from-purple-50
                  via-white
                  to-indigo-50
                  p-5
                "
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                    Question {index + 1} of{" "}
                    {questions.length}
                  </span>

                  <span
                    className="
                      rounded-full
                      border
                      border-purple-100
                      bg-white/80
                      px-2
                      py-1
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-purple-500
                    "
                  >
                    Voice only
                  </span>
                </div>

                {/* Progress */}

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-purple-100">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-purple-600
                      to-indigo-500
                      transition-all
                      duration-500
                    "
                    style={{
                      width: `${
                        ((index + 1) /
                          questions.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {/* QUESTION */}

                <p className="mt-7 text-center text-[19px] font-black leading-8 tracking-tight text-gray-950">
                  {questions[index].text}
                </p>

                {/* RECOGNIZED TEXT */}

                <div className="mt-5 min-h-[52px] text-center">
                  {text ? (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-purple-400">
                        I heard
                      </p>

                      <p className="mt-1 text-sm font-medium leading-6 text-gray-600">
                        “{text}”
                      </p>
                    </div>
                  ) : (
                    <p className="pt-3 text-xs font-medium text-gray-400">
                      {speaking
                        ? "Finora is speaking..."
                        : listening
                        ? "I'm listening..."
                        : processing
                        ? "Processing your answer..."
                        : "Tap the microphone and speak naturally"}
                    </p>
                  )}
                </div>

                {/* MIC */}

                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={
                      listening
                        ? stopListening
                        : startListening
                    }
                    disabled={
                      speaking ||
                      processing
                    }
                    aria-label={
                      listening
                        ? "Stop listening"
                        : "Start speaking"
                    }
                    className={`
                      relative
                      flex
                      h-[72px]
                      w-[72px]
                      items-center
                      justify-center
                      rounded-full
                      text-white
                      shadow-xl
                      transition-all
                      duration-300
                      ${
                        listening
                          ? "scale-110 bg-red-500 shadow-red-500/30"
                          : "bg-purple-600 shadow-purple-600/30 hover:scale-105 hover:bg-purple-700"
                      }
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    `}
                  >
                    {listening && (
                      <>
                        <span className="absolute inset-0 animate-ping rounded-full bg-red-400/25" />

                        <span className="absolute -inset-2 rounded-full border border-red-300/40" />
                      </>
                    )}

                    {listening ? (
                      <MicOff
                        className="relative z-10"
                        size={25}
                      />
                    ) : (
                      <Mic
                        className="relative z-10"
                        size={25}
                      />
                    )}
                  </button>
                </div>

                {/* STATUS */}

                <div className="mt-4 flex items-center justify-center gap-2">
                  <Volume2
                    size={13}
                    className={
                      listening
                        ? "text-red-400"
                        : "text-purple-400"
                    }
                  />

                  <span className="text-[10px] font-semibold text-gray-400">
                    {listening
                      ? "Listening for your answer"
                      : speaking
                      ? "Finora is speaking"
                      : processing
                      ? "Saving your answer"
                      : "Ready"}
                  </span>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-center text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* MANUAL RETRY ONLY */}

              <button
                type="button"
                onClick={startListening}
                disabled={
                  listening ||
                  speaking ||
                  processing
                }
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-gray-600
                  transition-all
                  hover:border-purple-200
                  hover:bg-purple-50
                  hover:text-purple-600
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Mic size={14} />
                {text
                  ? "Answer again"
                  : "Start speaking"}
              </button>
            </>
          ) : (
            /* COMPLETED */

            <div className="mt-6">
              <div
                className="
                  rounded-[26px]
                  border
                  border-emerald-100
                  bg-gradient-to-br
                  from-emerald-50
                  via-white
                  to-teal-50
                  p-7
                  text-center
                "
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={28} />
                </div>

                <h3 className="mt-5 text-xl font-black text-gray-950">
                  Check-in complete
                </h3>

                <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-gray-500">
                  I've captured your answers and prepared them for your Finora financial profile.
                </p>

                <div className="mt-5 rounded-2xl bg-white/80 px-4 py-3 text-xs font-semibold text-emerald-700 shadow-sm">
                  {Object.keys(answers).length} answers captured
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-gray-950
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-white
                  transition-all
                  hover:bg-purple-700
                  hover:shadow-lg
                "
              >
                <Check size={14} />
                Continue to Dashboard
              </button>
            </div>
          )}

          <p className="mt-3 text-center text-[9px] leading-4 text-gray-400">
            Finora listens only while you answer. Your response is automatically captured after a short pause.
          </p>
        </div>
      </section>
    </div>
  );
}