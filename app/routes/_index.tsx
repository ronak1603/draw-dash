import { Key } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { prisma } from "../utils/db.server";
import { badRequest } from "../utils/request.server";
import Landing from "../components/landing";
import { getUser, requireUserId, getUserId } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | Drawdash" },
    { name: "description", content: "Home of Drawdash!" },
  ];
};

function validateDrawingName(name: string) {
  if (name.length < 3) {
    return "Enter at least 3 characters";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const form = await request.formData();
  const name = form.get("name");

  if (typeof name !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { name };
  const fieldErrors = {
    name: validateDrawingName(name),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const drawingData = await prisma.drawing.create({
    data: {
      creatorId: userId,
      name,
    },
  });

  return redirect("/drawing/" + drawingData.id, { status: 303 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    return json({
      userId: null,
      user: null,
      drawings: [],
    });
  }

  const user = await getUser(request);

  const drawings = await prisma.drawing.findMany({
    where: {
      creatorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return json({
    userId,
    user,
    drawings,
  });
};

export default function Index() {
  const newActionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  if (!data.userId) {
    return <Landing />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">{`Hi ${data.user.username}`}</h1>
        <form action="/logout" method="post">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
            type="submit"
          >
            Logout
          </button>
        </form>
      </div>

      <form action="?index" method="post" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-700">
          Create a New Drawing
        </h2>

        <div className="flex flex-row justify-start items-start pt-4">
          <div>
            <input
              type="text"
              id="name-input"
              name="name"
              placeholder="Drawing Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-errormessage={
                newActionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />

            {newActionData?.fieldErrors?.name ? (
              <p
                className="text-red-500 text-sm mt-1"
                role="alert"
                id="name-error"
              >
                {newActionData.fieldErrors.name}
              </p>
            ) : null}
          </div>

          <button
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded md:mt-0 md:ml-4 ml-2"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>

      {data.drawings.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
            Your Drawings
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {data.drawings.map((drawing: { id: Key; name: string }) => (
              <li
                key={drawing.id}
                className="bg-white shadow-lg rounded-lg p-4"
              >
                <Link
                  to={`/drawing/${drawing.id}`}
                  className="text-lg font-medium text-blue-500 hover:text-blue-600"
                >
                  {drawing.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
