const crypto = require('crypto');

/**
 * Generates a standard mock transaction ID: MOCK_TXN_YYYYMMDD_XXXXXX
 */
const generateMockTransactionId = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `MOCK_TXN_${yyyy}${mm}${dd}_${randomHex}`;
};

module.exports = {
  generateMockTransactionId,
};
