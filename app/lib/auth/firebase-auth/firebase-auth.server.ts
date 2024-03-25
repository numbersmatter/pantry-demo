import { Session } from "@remix-run/node";
import { authFirebase } from "./firebase.server";

// export const checkSessionCookie = async (session: Session) => {
//   try {
//     const decodedIdToken = await authFirebase.server.verifySessionCookie(
//       session.get("session") || ""
//     );
//     return decodedIdToken;
//   } catch {
//     return { uid: undefined };
//   }
// };

export const signInWithToken = async (idToken: string) => {
  const expiresIn = 1000 * 60 * 60 * 24 * 7; // 1 week
  const sessionCookie = await authFirebase.server.createSessionCookie(idToken, {
    expiresIn,
  });
  return sessionCookie;
};

export const signIn = async (email: string, password: string) => {
  const { idToken } = await authFirebase.signInWithPassword(email, password);
  return signInWithToken(idToken);
};
