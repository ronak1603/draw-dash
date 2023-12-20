import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  return json({
    users: await db.user.findMany(),
  });
};

export default function Users() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <div>ronak</div>
    </>
  );
}
