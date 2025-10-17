import { HomeNavbar } from "@/components/shared/Navbar";
import { homeNav } from "@/constants";
import { auth } from "@/lib/auth";
import React, { ReactNode } from "react";

export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  console.log(session);
  return (
    <>
      {" "}
      {session?.user?.id ? (
        <HomeNavbar
          isLoggedIn={!!session?.user?.id}
          logoText="Arfat"
          user={{
            name: session?.user?.name as string,
            email: session?.user?.email as string,
            avatar: session?.user?.image as string,
          }}
        />
      ) : (
        <HomeNavbar logoText="Arfat" />
      )}
      <div className="container mx-auto min-h-[calc(100vh-70px)] w-full sm:px-6 md:w-4/5 lg:px-8">
        {children}
      </div>
    </>
  );
}
