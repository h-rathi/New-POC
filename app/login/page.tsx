"use client";
import { CustomButton, SectionTitle, Label } from "@/components";
import { trackSuccessfulLogin } from "@/lib/posthog-user";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
 
 
const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [shouldTrackLogin, setShouldTrackLogin] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
 
  useEffect(() => {
    // Check if session expired
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      setError("Your session has expired. Please log in again.");
      toast.error("Your session has expired. Please log in again.");
    }
 
    // if user has already logged in redirect to home page
    if (sessionStatus === "authenticated" && !shouldTrackLogin) {
      router.replace("/");
    }
  }, [sessionStatus, router, searchParams, shouldTrackLogin]);

  useEffect(() => {
    if (
      shouldTrackLogin &&
      sessionStatus === "authenticated" &&
      session?.user?.id
    ) {
      trackSuccessfulLogin(session.user.id);
      setShouldTrackLogin(false);
      router.replace("/");
    }
  }, [router, session?.user?.id, sessionStatus, shouldTrackLogin]);
 
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
 
    if (!isValidEmailAddressFormat(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }
 
    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }
 
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
 
    if (res?.error) {
      setError("Invalid email or password");
      toast.error("Invalid email or password");
      setShouldTrackLogin(false);
      if (res?.url) router.replace("/");
    } else {
      const updatedSession = await getSession();

      if (updatedSession?.user?.id) {
        trackSuccessfulLogin(updatedSession.user.id);
        router.replace("/");
      } else {
        setShouldTrackLogin(true);
      }

      setError("");
      toast.success("Successful login");
    }
  };
 
  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="bg-white">
      <SectionTitle title="Login" path="Home | Login" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
 
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" required>Email address</Label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
 
              <div>
                <Label htmlFor="password" required>Password</Label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
 
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
 
                {/* <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="font-semibold text-black hover:text-black"
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>
 
              <div>
                <CustomButton
                  buttonType="submit"
                  text="Sign in"
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                />
              </div>
            </form>
 
            <div>
              <p className="text-red-600 text-center text-[16px] my-4">
                {error && error}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default LoginPage;
