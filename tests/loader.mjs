const srcRoot = new URL("../src/", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "next/server") {
    return nextResolve("next/server.js", context);
  }
  if (specifier.startsWith("@/")) {
    const targetUrl = new URL(specifier.slice(2), srcRoot).href;
    try {
      return await nextResolve(targetUrl, context);
    } catch {
      return nextResolve(`${targetUrl}.ts`, context);
    }
  }
  if (specifier.startsWith("../src/") && !/\.[a-z]+$/i.test(specifier)) {
    return nextResolve(`${specifier}.ts`, context);
  }
  if (
    context.parentURL?.includes("/src/") &&
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !/\.[a-z]+$/i.test(specifier)
  ) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      return nextResolve(specifier, context);
    }
  }
  return nextResolve(specifier, context);
}
