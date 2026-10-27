import { describe, expect, test } from "vitest";
import { resolveLocale } from "./locale";

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
