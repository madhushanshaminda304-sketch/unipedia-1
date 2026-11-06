const RETURN_KEY = "unipedia_ugc_return_v1";
export function safeUgcReturn(value: unknown) {
  if (typeof value !== "string" || !/^\/(courses|explore)(?:[?#]|$)/.test(value))
    return "/courses?view=results";
  try {
    const url = new URL(value, "https://unipedia.lk");
    return url.pathname + url.search + url.hash;
  } catch {
    return "/courses?view=results";
  }
}
export function rememberUgcReturn(value: string) {
  try {
    sessionStorage.setItem(RETURN_KEY, safeUgcReturn(value));
  } catch {}
}
export function ugcReturnDestination() {
  try {
    return safeUgcReturn(sessionStorage.getItem(RETURN_KEY));
  } catch {
    return "/courses?view=results";
  }
}
export function readHomeScope(search: string) {
  return new URLSearchParams(search).get("route") === "catalogue"
    ? ("catalogue" as const)
    : ("ugc" as const);
}
