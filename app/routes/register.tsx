// import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
// import { Link, useActionData, useSearchParams } from "@remix-run/react";

// import stylesheet from "../tailwind.css";

// import { db } from "~/utils/db.server";
// import { badRequest } from "~/utils/request.server";
// import { createUserSession } from "~/utils/auth.server";

// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: stylesheet },
// ];

// function validateUsername(userName: string) {
//   if (userName.length < 3) {
//     return "Usernames must be at least 3 characters long";
//   }
// }

// function validatePassword(password: string) {
//   if (password.length < 6) {
//     return "Passwords must be at least 6 characters long";
//   }
// }

// function validateUrl(url: string) {
//   const urls = ["/jokes", "/", "https://remix.run"];
//   if (urls.includes(url)) {
//     return url;
//   }
//   return "/jokes";
// }

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const form = await request.formData();
//   const loginType = form.get("loginType");
//   const password = form.get("password");
//   const userName = form.get("userName");
//   const name = form.get("name");
//   const redirectTo = validateUrl(
//     (form.get("redirectTo") as string) || "/jokes"
//   );

//   console.log("types", form);
//   if (
//     typeof password !== "string" ||
//     typeof userName !== "string" ||
//     typeof name !== "string"
//   ) {
//     return badRequest({
//       fieldErrors: null,
//       fields: null,
//       formError: "Form not submitted correctly.",
//     });
//   }

//   const fields = { loginType, password, userName, name };
//   const fieldErrors = {
//     password: validatePassword(password),
//     userName: validateUsername(userName),
//   };
//   if (Object.values(fieldErrors).some(Boolean)) {
//     return badRequest({
//       fieldErrors,
//       fields,
//       formError: null,
//     });
//   }

//   const userExists = await db.user.findFirst({
//     where: { userName },
//   });
//   if (userExists) {
//     return badRequest({
//       fieldErrors: null,
//       fields,
//       formError: `User with username ${userName} already exists`,
//     });
//   }
//   // create the user
//   // create their session and redirect to /jokes
//   const newUser = await db.user.create({
//     data: {
//       name: fields.name,
//       userName: fields.userName,
//       password: fields.password,
//     },
//   });
//   return createUserSession(newUser.id, redirectTo);
// };

// export default function Register() {
//   const actionData = useActionData<typeof action>();
//   const [searchParams] = useSearchParams();
//   return (
//     <div className="flex flex-col justify-center items-center h-screen bg-blue-100">
//       <h2 className="text-2xl font-semibold mb-4 text-center font-roboto">
//         Register
//       </h2>
//       <div className="bg-white rounded-lg px-8 pt-6 pb-8 mb-4 max-w-md w-full border ring-blue-300 ring-opacity-50 shadow-md">
//         <form method="post" className="flex flex-col">
//           <input
//             type="hidden"
//             name="redirectTo"
//             value={searchParams.get("redirectTo") ?? undefined}
//           />
//           <div className="mb-4">
//             <label
//               htmlFor="name-input"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Name
//             </label>
//             <input
//               type="text"
//               name="userName"
//               defaultValue={actionData?.fields?.name}
//               aria-invalid={Boolean(actionData?.fieldErrors?.name)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-offset-0"
//             />
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="username-input"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Username
//             </label>
//             <input
//               type="text"
//               name="userName"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-offset-0"
//               defaultValue={actionData?.fields?.username}
//               aria-invalid={Boolean(actionData?.fieldErrors?.username)}
//               aria-errormessage={
//                 actionData?.fieldErrors?.username ? "username-error" : undefined
//               }
//             />
//             {actionData?.fieldErrors?.username ? (
//               <p
//                 className="form-validation-error"
//                 role="alert"
//                 id="username-error"
//               >
//                 {actionData.fieldErrors.username}
//               </p>
//             ) : null}
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="password-input"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Password
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-offset-0"
//               name="password"
//               type="password"
//               defaultValue={actionData?.fields?.password}
//               aria-invalid={Boolean(actionData?.fieldErrors?.password)}
//               aria-errormessage={
//                 actionData?.fieldErrors?.password ? "password-error" : undefined
//               }
//             />
//             {actionData?.fieldErrors?.password ? (
//               <p
//                 className="form-validation-error"
//                 role="alert"
//                 id="password-error"
//               >
//                 {actionData.fieldErrors.password}
//               </p>
//             ) : null}
//           </div>
//           <div id="form-error-message">
//             {actionData?.formError ? (
//               <p className="form-validation-error" role="alert">
//                 {actionData.formError}
//               </p>
//             ) : null}
//           </div>
//           <div className="flex justify-center">
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none"
//               type="submit"
//             >
//               Login
//             </button>
//           </div>
//         </form>
//       </div>
//       <div className="links">
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/jokes">Jokes</Link>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }
