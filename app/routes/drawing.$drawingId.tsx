import { useCallback } from "react";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useParams, useSubmit } from "@remix-run/react";
import useHydrate from "~/hooks/hydration";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import Draw from "~/components/Draw.client";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.drawing.name + " | Drawing - Drawdash" },
    { name: "description", content: "Drawing!" },
  ];
};

export const action: ActionFunction = async ({ request, params }) => {
  console.log("action drawing");
  const userId = await requireUserId(request);
  const drawingId = params.drawingId;

  const data = {
    ...Object.fromEntries(await request.formData()),
  };

  await prisma.drawing.update({
    where: {
      id: drawingId,
      creatorId: userId,
    },
    data: {
      content: data.stringifiedSnapshot as string,
    },
  });

  return json({
    message: "Drawing saved!",
  });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const drawing = await prisma.drawing.findUnique({
    where: {
      id: params.drawingId,
      creatorId: userId,
    },
  });

  if (!drawing) {
    return redirect("/");
  }

  return json({
    drawing,
  });
};

const Drawing = () => {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const { drawingId } = useParams();

  const isHydrated = useHydrate();

  const handleSaveDrawing = useCallback(
    async (stringifiedSnapshot: string) => {
      console.log("handleSaveDrawing");
      submit(
        { stringifiedSnapshot },
        { method: "post", action: "/drawing/" + drawingId, navigate: false }
      );
    },
    [drawingId, submit]
  );

  return isHydrated ? (
    <Draw
      drawingJson={data.drawing.content}
      handleSaveDrawing={handleSaveDrawing}
    />
  ) : null;
};

export default Drawing;
