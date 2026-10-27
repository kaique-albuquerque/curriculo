import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem("curriculo-locale", "pt");
  window.history.replaceState({}, "", "/");
});

describe("App", () => {
  test("mostra a empresa em cada experiencia", () => {
    render(<App />);
    expect(screen.getAllByText(/Pluma Genetics/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(/Solinftec/).length).toBeGreaterThanOrEqual(1);
  });

  test("nao renderiza mais a secao Objetivo", () => {
    render(<App />);
    expect(screen.queryByRole("heading", { name: /^Objetivo$/i })).toBeNull();
  });

  test("mostra os idiomas com nivel", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /Idiomas/ })).not.toBeNull();
    expect(screen.getAllByText(/A2/).length).toBeGreaterThanOrEqual(1);
  });

  test("nao imprime campos opcionais vazios", () => {
    render(<App />);
    expect(screen.queryByText(/undefined/)).toBeNull();
  });

  test("troca para ingles e atualiza o documento", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("heading", { name: /Selected projects/ })).not.toBeNull();
    expect(screen.queryByRole("heading", { name: /Projetos aplicados/ })).toBeNull();
  });
});
