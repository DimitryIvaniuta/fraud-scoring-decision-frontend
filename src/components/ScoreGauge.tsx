import { useId } from 'react';

interface ScoreGaugeProps {
  readonly score: number;
}

/** Lightweight SVG gauge that avoids external chart dependencies and unsafe HTML. */
export function ScoreGauge({ score }: ScoreGaugeProps) {
  const titleId = useId();
  const safeScore = Math.max(0, Math.min(100, score));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="score-gauge" aria-label={`Fraud score ${safeScore} out of 100`}>
      <svg viewBox="0 0 140 140" role="img" aria-labelledby={titleId}>
        <title id={titleId}>Fraud score {safeScore} out of 100</title>
        <circle className="score-track" cx="70" cy="70" r={radius} />
        <circle
          className="score-progress"
          cx="70"
          cy="70"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div>
        <strong>{safeScore}</strong>
        <span>/100</span>
      </div>
    </div>
  );
}
