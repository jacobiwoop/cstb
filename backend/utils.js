/**
 * Utilitaires pour le backend CSTB
 */

/**
 * Formate le nom du donateur proprement
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
const formatDonorName = (firstName, lastName) => {
  const full = `${firstName || ""} ${lastName || ""}`.trim();
  return full || "Donateur anonyme";
};

/**
 * Valide si un montant est correct (positif et entier)
 * @param {number|string} amount
 * @returns {boolean}
 */
const isValidAmount = (amount) => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
};

module.exports = {
  formatDonorName,
  isValidAmount,
};
