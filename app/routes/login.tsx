import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import SignInScreen from "~/components/pages/login-page";
import { authenticator } from "~/lib/auth/auth.server";
import { AuthStrategies } from "~/lib/auth/auth_strategies";
import { commitSession, getSession } from "~/lib/auth/sessions.server";




export const loader = async ({ request }: LoaderFunctionArgs) => {
  let user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  let session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);


  if (user) {
    return json({ user });
  }
  return json({ error }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  const requestClone = await request.clone();
  const formData = await requestClone.formData();
  console.log("data:", formData);
  // Do something with the data
  return await authenticator.authenticate(
    AuthStrategies.FORM,
    request,
    {
      successRedirect: "/",
      failureRedirect: "/login",
    }
  )
};

export default function FormRoute() {
  const data = useLoaderData<typeof loader>();
  console.log("data:", data);

  return (
    <SignInScreen />
  );
}

