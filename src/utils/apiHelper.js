import faqs from '../data/faqs.json';

/**
 * Match user query against pre-prepared FAQ responses
 */
export function matchFAQ(query) {
  const lower = query.toLowerCase();
  for (const faq of faqs) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer;
    }
  }
  return null;
}

/**
 * Call Claude API with timeout and error handling
 */
export async function callClaudeAPI(question) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null; // Will trigger fallback
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `You are an expert on Indian elections and voting. Answer this question in simple, clear language suitable for first-time voters. Keep your answer under 80 words, use plain text only (no markdown formatting, no bullet points, no asterisks): ${question}`,
          },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch (err) {
    clearTimeout(timeout);
    if (import.meta.env.DEV) {
      console.debug('[VoteFlow] API call failed:', err.message);
    }
    return null;
  }
}

/**
 * Debounce utility to prevent rapid API calls
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * Validate Voter ID format (2-3 letters + 7 digits, or similar patterns)
 */
export function validateVoterId(id) {
  const cleaned = id.trim().toUpperCase();
  if (cleaned.length < 6 || cleaned.length > 12) return false;
  return /^[A-Z]{2,3}[0-9]{6,9}$/.test(cleaned);
}

/**
 * Validate PIN code (6 digits)
 */
export function validatePinCode(pin) {
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}
