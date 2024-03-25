import { Authenticator } from "remix-auth";
import { sessionStorage } from "./sessions.server";
import { User } from "./types";
import { AuthStrategies } from "./auth_strategies";
import { formStrategy } from "./auth_strategies/form.strategy";
import { staffDb } from "../database/staff/staff-crud.server";

export type AuthStrategy = (typeof AuthStrategies)[keyof typeof AuthStrategies];

export let authenticator = new Authenticator<User>(sessionStorage);

export interface StaffInfo {
  fname: string;
  lname: string;
}

export const protectedRoute = async (request: Request) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const staff = await staffDb.read(user.uid);

  const staffData: StaffInfo = {
    fname: staff ? staff.fname : "no f name",
    lname: staff ? staff.lname : "no l name",
  };
  return { user, staffData };
};

// Register your strategies below
authenticator.use(formStrategy, AuthStrategies.FORM);
