import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem("curriculo-locale", "pt");
  window.history.replaceState({}, "", "/");

  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.setAttribute("name", "description");
    document.head.appendChild(description);
  }
  description.setAttribute("content", "Currículo online de Kaique Albuquerque.");
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
    expect(document.title).toBe("Kaique Albuquerque — Resume");
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute("content"),
    ).toContain("full-stack");
  });

  test("traduz os rotulos do seletor de tema", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByRole("button", { name: "Light" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Dark" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Claro" })).toBeNull();
  });

  test("nao renderiza nos vazios para campos opcionais", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll(".stack-subtitle").length).toBe(5);
    for (const node of container.querySelectorAll(".stack-item strong")) {
      expect(node.textContent?.trim()).not.toBe("");
    }
    for (const node of container.querySelectorAll(".stack-subtitle")) {
      expect(node.textContent?.trim()).not.toBe("");
    }
  });

  test("respeita ?lang=en na primeira renderizacao", () => {
    window.history.replaceState({}, "", "/?lang=en");
    render(<App />);
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("heading", { name: /Selected projects/ })).not.toBeNull();
  });

  test("todo projeto linkado abre em nova aba", () => {
    const { container } = render(<App />);
    const links = [...container.querySelectorAll(".project-links a")];

    expect(links.length).toBe(6);
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
    expect(links.map((link) => link.getAttribute("href"))).toContain(
      "https://github.com/kaique-albuquerque/streamgrab",
    );
  });

  test("mostra espanhol B1 com link do comprovante", () => {
    const { container } = render(<App />);
    const items = [...container.querySelectorAll(".language-list li")].map(
      (item) => item.textContent ?? "",
    );
    const spanish = items.find((item) => item.includes("Espanhol"));

    expect(spanish).toContain("B1");
    expect(spanish).toContain("SIELE");

    const links = [...container.querySelectorAll(".language-list a")];
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toContain("19CObvEgNUtG2Nzq72OdcDkqfSzZxu8Og");
    expect(links[0].getAttribute("target")).toBe("_blank");
    expect(links[0].getAttribute("rel")).toContain("noopener");
  });
});
