import { describe, expect, test } from "vitest";
import { getStored, resolveLocale, setStored } from "./locale";

describe("resolveLocale", () => {
  test("prioriza ?lang valido", () => {
    expect(resolveLocale("?lang=en", "pt", "pt-BR")).toBe("en");
  });

  test("ignora ?lang invalido e usa o armazenado", () => {
    expect(resolveLocale("?lang=xx", "en", "pt-BR")).toBe("en");
  });

  test("ignora valor arbitrario no armazenamento", () => {
    expect(resolveLocale("", "klingon", "pt-BR")).toBe("pt");
  });

  test("aceita variantes do armazenamento", () => {
    expect(resolveLocale("", "en_US", "pt-BR")).toBe("en");
  });

  test("usa o idioma do navegador sem preferencia salva", () => {
    expect(resolveLocale("", null, "en-US")).toBe("en");
    expect(resolveLocale("", null, "pt-BR")).toBe("pt");
  });

  test("cai para pt sem nenhuma informacao", () => {
    expect(resolveLocale("", null, "")).toBe("pt");
  });
});

describe("storage tolerante a bloqueio", () => {
  const storageKey = "curriculo-locale";

  test("getStored devolve o valor salvo", () => {
    window.localStorage.setItem(storageKey, "en");
    expect(getStored(storageKey)).toBe("en");
  });

  test("getStored devolve null quando o acesso lanca", () => {
    const original = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("SecurityError");
      },
    });

    try {
      expect(getStored(storageKey)).toBeNull();
    } finally {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: original,
      });
    }
  });

  test("setStored nao propaga erro quando o acesso lanca", () => {
    const original = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("SecurityError");
      },
    });

    try {
      expect(() => setStored(storageKey, "en")).not.toThrow();
    } finally {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: original,
      });
    }
  });
});

