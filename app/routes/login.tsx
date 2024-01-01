import { useEffect, useRef, useState } from "react";
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";

import { FormField } from "~/components/formField";
import { Layout } from "~/components/layout";
import {
  onValidUsername,
  validateName,
  validatePassword,
} from "~/utils/validators.server";
import { getUser, login, register } from "~/utils/auth.server";
import { useActionData } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import { prisma } from "~/utils/db.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const action = form.get("_action");
  const userName = form.get("userName");
  const password = form.get("password");
  const fullName = form.get("name");
  console.log("#### formdata", form);
  if (
    typeof action !== "string" ||
    typeof userName !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  if (action === "register" && typeof fullName !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  console.log("#### after register");

  const fields = {
    action,
    password,
    fullName,
    userName,
  };

  const fieldErrors = {
    userName: onValidUsername(userName),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          name: validateName((fullName as string) || ""),
        }
      : {}),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (action) {
    case "login": {
      const user = await login({ userName, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Username/Password combination is incorrect",
        });
      }

      return user;
    }
    case "register": {
      const name = fullName as string;

      const userExists = await prisma.user.findFirst({
        where: { userName },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${userName} already exists`,
        });
      }
      const user = await register({
        userName,
        password,
        name,
      });

      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: "Something went wrong trying to create a new user.",
        });
      }

      return user;
    }
    default:
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Login type invalid",
      });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  console.log(actionData, " #### actionData");

  const firstLoad = useRef(true);

  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    name: "",
  });

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        name: "",
        userName: "kody",
        password: "ronak123",
      };
      setFormError("");
      setFormData(newState);
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <h2 className="text-5xl font-extrabold text-yellow-300">
          <button
            onClick={() =>
              actionData.fields.action == "login" ? "register" : "login"
            }
            className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            {actionData.fields.action === "login" ? "Sign Up" : "Sign In"}
          </button>
        </h2>
        <p className="font-semibold text-slate-300">
          {actionData.fields.action === "login"
            ? "Log In To Get Started!"
            : "Sign Up To Get Started!"}
        </p>

        <form method="POST" className="rounded-2xl bg-gray-200 p-6 w-96">
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {formError}
          </div>
          {actionData.fields.action === "register" && (
            <FormField
              htmlFor="name"
              label="Name"
              onChange={(e) => handleInputChange(e, "name")}
              value={formData.name}
              error={actionData.fieldErrors.name}
            />
          )}
          <FormField
            htmlFor="userName"
            label="UserName"
            value={formData.userName}
            onChange={(e) => handleInputChange(e, "userName")}
            error={actionData.fieldErrors.userName}
          />
          <FormField
            htmlFor="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            error={actionData.fieldErrors.password}
          />

          <div className="w-full text-center">
            <button
              type="submit"
              name="_action"
              value={actionData.fields.action}
              className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            >
              {actionData.fields.action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
