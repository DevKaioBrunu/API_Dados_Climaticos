const axios = require("axios");

const DEFAULT_TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS) || 5000;
const DEFAULT_RETRIES = Number(process.env.HTTP_RETRIES) || 2;
const DEFAULT_RETRY_DELAY_MS =
  Number(process.env.HTTP_RETRY_DELAY_MS) || 300;

const RETRY_STATUSES = new Set([408, 429, 502, 503, 504]);
const RETRY_CODES = new Set([
  "ECONNABORTED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ECONNREFUSED",
]);

function shouldRetry(error) {
  if (!error) {
    return false;
  }

  if (error.code && RETRY_CODES.has(error.code)) {
    return true;
  }

  const status = error.response?.status;
  return status != null && RETRY_STATUSES.has(status);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWithRetry(url, options = {}, retryOptions = {}) {
  const retries = Number.isInteger(retryOptions.retries)
    ? retryOptions.retries
    : DEFAULT_RETRIES;
  const retryDelayMs = Number.isInteger(retryOptions.retryDelayMs)
    ? retryOptions.retryDelayMs
    : DEFAULT_RETRY_DELAY_MS;
  const timeout =
    retryOptions.timeout != null ? retryOptions.timeout : DEFAULT_TIMEOUT_MS;

  let attempt = 0;

  while (true) {
    try {
      const requestOptions = { timeout, ...options };
      return await axios.get(url, requestOptions);
    } catch (error) {
      attempt += 1;
      if (attempt > retries || !shouldRetry(error)) {
        throw error;
      }

      const waitMs = retryDelayMs * attempt;
      await sleep(waitMs);
    }
  }
}

module.exports = { getWithRetry, shouldRetry };
