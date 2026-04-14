const { formatDonorName, isValidAmount } = require("../utils");

describe("Backend Utils", () => {
  describe("formatDonorName", () => {
    it("devrait retourner le nom complet si les deux sont fournis", () => {
      expect(formatDonorName("Aiko", "Antigravity")).toBe("Aiko Antigravity");
    });

    it("devrait retourner uniquement le prénom si le nom est manquant", () => {
      expect(formatDonorName("Aiko", null)).toBe("Aiko");
    });

    it('devrait retourner "Donateur anonyme" si tout est vide', () => {
      expect(formatDonorName(null, undefined)).toBe("Donateur anonyme");
    });
  });

  describe("isValidAmount", () => {
    it("devrait valider un montant positif entier", () => {
      expect(isValidAmount(1000)).toBe(true);
      expect(isValidAmount("5000")).toBe(true);
    });

    it("devrait rejeter un montant négatif", () => {
      expect(isValidAmount(-100)).toBe(false);
    });

    it("devrait rejeter un montant non entier (décimal)", () => {
      expect(isValidAmount(10.5)).toBe(false);
    });

    it("devrait rejeter du texte non numérique", () => {
      expect(isValidAmount("gratuit")).toBe(false);
    });
  });
});
