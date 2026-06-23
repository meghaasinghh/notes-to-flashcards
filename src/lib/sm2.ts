// SM-2 spaced repetition algorithm
// Quality rating: 0-5, where:
// 0-2 = incorrect/hard (resets repetitions)
// 3 = correct but difficult
// 4 = correct, good
// 5 = correct, easy

interface SM2Input {
  quality: number; // 0-5
  easinessFactor: number;
  interval: number;
  repetitions: number;
}

interface SM2Output {
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

export function calculateSM2({
  quality,
  easinessFactor,
  interval,
  repetitions,
}: SM2Input): SM2Output {
  let newEF = easinessFactor;
  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    // Incorrect or too difficult — reset progress
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easinessFactor);
    }
  }

  // Update easiness factor based on quality of recall
  newEF =
    easinessFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // EF should never drop below 1.3
  if (newEF < 1.3) {
    newEF = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easinessFactor: newEF,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}