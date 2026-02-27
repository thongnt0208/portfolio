export const MIN_RESPONSE_LENGTH = 4;

export const FALLBACK_RESPONSE =
  "I'm sorry, I couldn't generate a proper response. Please try asking in a different way.";

export const truncateToTokenLimit = (text: string, maxTokens: number): string => {
  const maxWords = Math.floor(maxTokens * 0.75);
  const words = text.split(/\s+/);
  return words.length <= maxWords ? text : `${words.slice(0, maxWords).join(' ')}...`;
};
