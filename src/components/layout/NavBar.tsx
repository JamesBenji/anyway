"use client";
import { LanguagesIcon } from "lucide-react";
import Container from "./Container";
import Link from "next/link";
import { SignOutButton, useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isProtected = pathname.includes('protected')


  return (
    <div className="sticky top-0 border border-b-primary/10">
      <Container>
        <div className="flex justify-between">
          <div className="flex items-center gap-1 font-bold text-xl cursor-pointer">
            <Link href={"/"}>Anyway</Link>
            <div className="bg-orange-400 rounded-full p-1">
              <LanguagesIcon size={15} className="text-white " />
            </div>
          </div>

          {userId && isProtected ? (
            <div className="flex items-center gap-4">
              <UserButton />
              <div className="border border-gray-800 text-gray-800 px-4 py-1 rounded-md">
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href={"/sign-in"}>
                <Button variant={"outline"}>Sign in</Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
