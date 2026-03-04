import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function getCurrentUserOrThrow() {
  const session = await getServerSession(authOptions);



  if (!session?.user?.id) {
    throw new Error("UNAUTHENTICATED");
  }

  return session.user;
}
