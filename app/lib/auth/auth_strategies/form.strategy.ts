// Refer to https://github.com/sergiodxa/remix-auth-form for more information
import { FormStrategy, FormStrategyVerifyParams } from "remix-auth-form";
import { User } from "../types";
import { signIn, signInWithToken } from "../firebase-auth/firebase-auth.server";
import { authFirebase } from "../firebase-auth/firebase.server";
import { zfd } from "zod-form-data";
import * as z from "zod";
// import { signIn, signInWithToken } from "../auth-firebase.server";
// import { auth } from "../firebase/firebase.server";

const signInSchema = zfd.formData({
  email: zfd.text(z.string().email()),
  password: zfd.text(z.string().min(6)),
});

export const formStrategy = new FormStrategy<User>(async ({ form }) => {
  // Do something with the tokens and profile
  const idToken = form.get("idToken");

  if (typeof idToken === "string") {
    let sessionCookie = await signInWithToken(idToken);
    const decodedIdToken = await authFirebase.server.verifySessionCookie(
      sessionCookie || ""
    );
    const user: User = {
      uid: decodedIdToken.uid,
      email: decodedIdToken.email,
    };
    return user;
  } else {
    const { email, password } = signInSchema.parse(form);

    let sessionCookie = await signIn(email, password);
    const decodedIdToken = await authFirebase.server.verifySessionCookie(
      sessionCookie || ""
    );
    const user: User = {
      uid: decodedIdToken.uid,
    };
    return user;
  }
});
