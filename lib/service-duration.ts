const DURATION_SUFFIX_REGEX = /\((\d+)\s*min\)\s*$/i;

export function getServiceDurationInMinutes(description: string, fallback = 30) {
  const match = description.match(DURATION_SUFFIX_REGEX);
  if (!match) {
    return fallback;
  }

  const parsedDuration = Number(match[1]);
  if (!Number.isFinite(parsedDuration) || parsedDuration < 5) {
    return fallback;
  }

  return parsedDuration;
}
