export const onRequest = async ({ request, env, next }) => {
  const auth = request.headers.get("authorization") || "";
  const [scheme, encoded] = auth.split(" ");
  const expected = btoa(`${env.BASIC_USER || "user"}:${env.BASIC_PASS || "pass"}`);
  if (scheme !== "Basic" || encoded !== expected) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
    });
  }
  return next();
};
