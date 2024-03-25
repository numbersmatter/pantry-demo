import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/lib/auth/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export default function RouteComponent() {
  return (
    <div />
  );
}