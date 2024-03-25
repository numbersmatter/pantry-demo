import { json, type ActionFunctionArgs } from "@remix-run/node";
import SignInScreen from "~/components/pages/login-page";




export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  // const email = formData.get("email");
  console.log("data:", formData);
  return json({ message: "success" });
};


export default function Test() {


  return (
    <div>
      <h1>Test Route</h1>
      <SignInScreen />
    </div>
  );
}