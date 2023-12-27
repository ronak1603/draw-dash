// app/routes/login.tsx
import { useState } from "react";
import { FormField } from "~/components/formField";
import { Layout } from "~/components/layout";
import { ActionFunction, json } from "@remix-run/node";
import { validateName, validatePassword } from "~/utils/validators.server";
import { login, register } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const userName = form.get("userName");
  const password = form.get("password");
  const fullName = form.get("name");

  if (
    typeof action !== "string" ||
    typeof userName !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (action === "register" && typeof userName !== "string") {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    userName: validateName(userName),
    password: validatePassword(password),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      { errors, fields: { userName, password }, form: action },
      { status: 400 }
    );

  switch (action) {
    case "login": {
      return await login({ userName, password });
    }
    case "register": {
      const name = fullName as string;

      return await register({ userName, password, name });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
};

export default function Login() {
  const [action, setAction] = useState("login");

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    name: "",
  });

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
            onClick={() => setAction(action == "login" ? "register" : "login")}
            className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            {action === "login" ? "Sign Up" : "Sign In"}
          </button>
        </h2>
        <p className="font-semibold text-slate-300">
          {action === "login"
            ? "Log In To Get Started!"
            : "Sign Up To Get Started!"}
        </p>

        <form method="POST" className="rounded-2xl bg-gray-200 p-6 w-96">
          {action === "register" && (
            <FormField
              htmlFor="name"
              label="Name"
              onChange={(e) => handleInputChange(e, "name")}
              value={formData.name}
            />
          )}
          <FormField
            htmlFor="userName"
            label="UserName"
            value={formData.userName}
            onChange={(e) => handleInputChange(e, "userName")}
          />
          <FormField
            htmlFor="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
          />

          <div className="w-full text-center">
            <button
              type="submit"
              name="_action"
              value={action}
              className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            >
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
