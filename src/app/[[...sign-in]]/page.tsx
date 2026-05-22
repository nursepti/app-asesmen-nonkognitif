"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect otomatis jika pengguna sudah login dan memiliki role
    if (isLoaded && isSignedIn && user) {
      const role = user.publicMetadata.role;
      if (role) {
        router.push(`/${role}`);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Mencegah error "useClerk" dengan memastikan Clerk sudah ter-load sepenuhnya
  // sebelum merender komponen <SignIn.Root>
  if (!isLoaded) {
    return null; // Atau tampilkan loading spinner sederhana
  }

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-4 w-full max-w-[400px]"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Image src="/logo.png" alt="SchooLama Logo" width={24} height={24} />
              Asesmen non-kognitif
            </h1>
            <h2 className="text-gray-400">Sign in to your account</h2>
          </div>

          <Clerk.GlobalError className="text-sm text-red-400" />

          {/* Input Username / Email */}
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500 font-semibold">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          {/* Input Password */}
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500 font-semibold">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          {/* Tombol Sign In */}
          <SignIn.Action
            submit
            className="bg-blue-500 hover:bg-blue-600 text-white my-2 rounded-md text-sm p-[10px] font-medium transition-colors"
          >
            Sign In
          </SignIn.Action>

        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;