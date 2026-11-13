import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cn, formatBRL, createWhatsAppLink } from "../src/lib/utils";

describe("utils.cn", () => {
  it("combines class names and ignores falsy values", () => {
    assert.equal(cn("px-4", false && "hidden", undefined, "py-2"), "px-4 py-2");
  });

  it("merges conflicting Tailwind utility classes", () => {
    assert.equal(cn("px-2 py-1 text-sm", "px-6 text-base"), "py-1 px-6 text-base");
  });
});

describe("utils.formatBRL", () => {
  it("formats positive numbers as Brazilian Real currency", () => {
    const formatted = formatBRL(89.9).replace(/\u00a0/g, " ");
    assert.equal(formatted, "R$ 89,90");
  });

  it("formats thousands and zero correctly", () => {
    assert.equal(formatBRL(0).replace(/\u00a0/g, " "), "R$ 0,00");
    assert.equal(formatBRL(1250.5).replace(/\u00a0/g, " "), "R$ 1.250,50");
  });
});

describe("utils.createWhatsAppLink", () => {
  it("strips non-digit characters from phone and builds default greeting", () => {
    const url = createWhatsAppLink("(13) 97404-7020");
    assert.ok(url.startsWith("https://wa.me/13974047020?text="));
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    assert.match(decoded, /Olá, Dona Fátima!/);
    assert.doesNotMatch(decoded, /Tenho muito interesse na peça/);
  });

  it("includes product title and formatted price when provided", () => {
    const url = createWhatsAppLink("5513974047020", "Jaqueta Jeans Vintage", 120);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    assert.match(decoded, /\*Jaqueta Jeans Vintage\*/);
    assert.match(decoded, /R\$\s*120,00/);
    assert.match(decoded, /ainda está disponível/);
  });

  it("includes price even when price is 0", () => {
    const url = createWhatsAppLink("5513974047020", "Brinde Especial", 0);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    assert.match(decoded, /R\$\s*0,00/);
  });
});
