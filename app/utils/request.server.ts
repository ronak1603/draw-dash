import { json } from "@remix-run/node";

interface BadRequestPayload {
  fieldErrors?: any;
  fields?: any;
  formError?: any;
}

export function badRequest({
  fieldErrors,
  fields,
  formError,
}: BadRequestPayload): Response {
  const body: BadRequestPayload = {
    fieldErrors: fieldErrors || {},
    fields: fields || {},
    formError: formError || "Invalid form submission.",
  };

  // Respond with a JSON payload and a 400 Bad Request status code
  return json(body, {
    status: 400,
  });
}
