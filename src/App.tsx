import React from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { BackgroundScene } from "./BackgroundScene";
import type { ValentineContent } from "./types";

type Stage = "question" | "loader" | "confirmation";

const useContent = () => {
  const [content, setContent] = React.useState<ValentineContent | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}content.json`);
        if (!res.ok) throw new Error("Failed to load content.json");
        const data = (await res.json()) as ValentineContent;
        setContent(data);
      } catch (e) {
        console.error(e);
        setError("Unable to load content. Using defaults.");
      }
    };
    load();
  }, []);

  return { content, error };
};

const useCountdown = (targetDateIso: string | null) => {
  const [remainingMs, setRemainingMs] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!targetDateIso) return;
    const target = new Date(targetDateIso).getTime();
    const tick = () => {
      const now = Date.now();
      setRemainingMs(Math.max(0, target - now));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetDateIso]);

  const total = remainingMs ?? 0;
  const ended = total <= 0 && remainingMs !== null;

  const seconds = Math.floor(total / 1000);
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  return { days, hours, minutes, secs, ended, ready: remainingMs !== null };
};

export const App: React.FC = () => {
  const { content, error } = useContent();
  const [stage, setStage] = React.useState<Stage>("question");
  const [attempts, setAttempts] = React.useState(0);
  const [isMobile] = React.useState(false);

  const onYes = () => {
    setStage("loader");
    window.setTimeout(() => {
      setStage("confirmation");
    }, 10400);
  };

  const onNoAttempt = () => {
    setAttempts((prev) => prev + 1);
  };

  const escalationMessages = content?.escalationMessages ?? [];
  const escalationText =
    escalationMessages.length === 0 || attempts === 0
      ? ""
      : escalationMessages[(attempts - 1) % escalationMessages.length];

  const yesScale = useSpring(1, {
    stiffness: 180,
    damping: 22,
  });

  React.useEffect(() => {
    const yesTarget = 1 + attempts * 0.035;
    yesScale.set(yesTarget);
  }, [attempts, yesScale]);

  return (
    <div className="app-root">
      <BackgroundScene />
      <FloatingHeartsOverlay />
      <div className="app-overlay">
        <motion.div
          className="app-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span className="app-badge-dot" />
          <span>Valentine&apos;s invite</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            className="card-surface"
            initial={{ opacity: 0, y: 18, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {!content && !error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="app-subtitle"
              >
                Preparing something special for you…
              </motion.p>
            )}

            {error && (
              <p className="app-subtitle" style={{ marginBottom: "1.4rem" }}>
                {error}
              </p>
            )}

            {stage === "question" && content && (
              <QuestionStage
                content={content}
                attempts={attempts}
                escalationText={escalationText}
                onYes={onYes}
                onNoAttempt={onNoAttempt}
                yesScale={yesScale}
              />
            )}

            {stage === "loader" && content && (
              <LoaderStage content={content} />
            )}

            {stage === "confirmation" && content && (
              <ConfirmationStage content={content} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const FloatingHeartsOverlay: React.FC = () => {
  const hearts = React.useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * -20,
        duration: 14 + Math.random() * 16,
        scale: 0.6 + Math.random() * 0.9,
        char: Math.random() > 0.5 ? "💗" : "💖",
      })),
    []
  );

  return (
    <div className="floating-hearts-overlay">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            transform: `scale(${h.scale})`,
          }}
        >
          {h.char}
        </div>
      ))}
    </div>
  );
};

type QuestionStageProps = {
  content: ValentineContent;
  attempts: number;
  escalationText: string;
  onYes: () => void;
  onNoAttempt: () => void;
  yesScale: typeof useSpring extends (...args: any) => infer R ? R : any;
};

const QuestionStage: React.FC<QuestionStageProps> = ({
  content,
  attempts,
  escalationText,
  onYes,
  onNoAttempt,
  yesScale,
}) => {
  const [noBtnPosition, setNoBtnPosition] = React.useState({ x: 0, y: 0 });
  const [noMoved, setNoMoved] = React.useState(false);

  const handleNoMove = React.useCallback(() => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 120;

    const randomX = Math.random() * (maxX - 60) + 60;
    const randomY = Math.random() * (maxY - 80) + 80;

    setNoBtnPosition({
      x: randomX - window.innerWidth / 2,
      y: randomY - window.innerHeight / 2,
    });

    setNoMoved(true);
    onNoAttempt();
  }, [onNoAttempt]);

  return (
    <div className="question-stage-root">
      <motion.p
        className="app-subtitle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.6 }}
      >
        {content.question.subtitle}
      </motion.p>
      <motion.h1
        className="app-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        {content.question.title}
      </motion.h1>

      <motion.div
        className="buttons-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.55 }}
      >
        <motion.button
          className="btn btn-primary"
          style={{ scale: yesScale }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              "0 14px 35px rgba(255, 75, 122, 0.35)",
              "0 0 28px rgba(255, 105, 180, 0.75)",
              "0 14px 35px rgba(255, 75, 122, 0.35)",
            ],
          }}
          transition={{
            boxShadow: { repeat: Infinity, duration: 1.9, ease: "easeInOut" },
          }}
          onClick={onYes}
        >
          {content.buttons.yes}
        </motion.button>

        <motion.button
          className="btn btn-ghost"
          style={{
            position: noMoved ? "absolute" : "relative",
          }}
          animate={
            noMoved
              ? {
                  x: noBtnPosition.x,
                  y: noBtnPosition.y,
                  rotate: [0, 360, 720],
                  scale: [1, 0.8, 1.15, 1],
                  skewX: [0, 10, -10, 0],
                  skewY: [0, -6, 6, 0],
                }
              : { x: 0, y: 0, rotate: 0, scale: 1, skewX: 0, skewY: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 18,
          }}
          onMouseEnter={handleNoMove}
          onTouchStart={(e) => {
            e.preventDefault();
            handleNoMove();
          }}
        >
          {content.buttons.no}
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={attempts > 0 ? attempts : "none"}
          className="escalation-text"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
        >
          {escalationText}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

type LoaderStageProps = {
  content: ValentineContent;
};

const LoaderStage: React.FC<LoaderStageProps> = ({ content }) => {
  const [visibleSteps, setVisibleSteps] = React.useState(0);

  React.useEffect(() => {
    setVisibleSteps(0);
    const steps = content.loader.steps.length;
    const interval = 1800;
    const id = window.setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= steps) {
          window.clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [content.loader.steps]);

  const progress =
    content.loader.steps.length === 0
      ? 1
      : Math.min(
          1,
          (visibleSteps + 1) / (content.loader.steps.length + 1)
        );

  return (
    <div>
      <motion.h1
        className="app-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {content.loader.title}
      </motion.h1>

      <div className="loader-steps">
        {content.loader.steps.slice(0, visibleSteps).map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {step}
          </motion.div>
        ))}
      </div>

      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: "0%" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>

      <motion.p
        className="app-subtitle"
        style={{ marginTop: "1.4rem" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 7, duration: 0.7 }}
      >
        {content.loader.result}
      </motion.p>
    </div>
  );
};

type ConfirmationStageProps = {
  content: ValentineContent;
};

const ConfirmationStage: React.FC<ConfirmationStageProps> = ({ content }) => {
  const { days, hours, minutes, secs, ended, ready } = useCountdown(
    content.dateDetails.targetDate
  );

  const after = content.afterCountdown;

  return (
    <div className="confirmation-layout">
      <div>
        <motion.h1
          className="app-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {content.confirmation.title}
        </motion.h1>
        <motion.p
          className="app-subtitle"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6 }}
        >
          {content.confirmation.subtitle}
        </motion.p>
        <motion.p
          className="app-subtitle"
          style={{ marginTop: "0.8rem" }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.6 }}
        >
          {content.confirmation.finalMessage}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <h3
            style={{
              marginTop: "1.6rem",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,230,242,0.8)",
            }}
          >
            Countdown to our date
          </h3>
          {ready ? (
            <>
              <div className="countdown-grid">
                <div className="countdown-cell">
                  <div className="countdown-value">{days}</div>
                  <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-cell">
                  <div className="countdown-value">{hours}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-cell">
                  <div className="countdown-value">{minutes}</div>
                  <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-cell">
                  <div className="countdown-value">{secs}</div>
                  <div className="countdown-label">Seconds</div>
                </div>
              </div>
              {ended && (
                <div className="after-countdown">
                  <div>{after?.title ?? "Time for our date!"}</div>
                  <div>
                    {after?.subtitle ?? "Ps: It's ok if you're late ;p"}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="app-subtitle">Calculating the perfect timing…</p>
          )}

          <div className="date-note">
            <div>{content.dateDetails.location}</div>
            <div>{content.dateDetails.note}</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="photo-frame"
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="photo-inner">
          <img
            src={`${import.meta.env.BASE_URL}MMs.jpg`}
            alt="Us together"
            className="photo-img"
          />
          <div className="photo-overlay">
            A space for us 💕
            <div className="photo-hint">
              Replace this with your favorite picture together.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

