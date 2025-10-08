"use server";

import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { LoginSchema } from "@/zod-schemas/auth";
import { AuthError } from "next-auth";
import z from "zod";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.parse(data);

  //  If the data is invalid, return an error
  if (!validatedData) {
    return { error: "Invalid input data" };
  }

  //  Destructure the validated data
  const { email, password } = validatedData;

  // Check to see if user already exists
  const userExists = await db.user.findFirst({
    where: {
      email,
    },
  });

  // If the user exists, return an error
  if (!userExists || !userExists.password || !userExists.email) {
    return { error: "User not found" };
  }

  try {
    await signIn("credentials", {
      email: userExists?.email,
      password: password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid credentials" };
        }
        default:
          return {
            error: "If email is correct, Please confirm your email address",
          };
      }
    }
    throw error;
  }
  return { success: "User login successfully" };
};
