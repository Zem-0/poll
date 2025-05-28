/* eslint-disable @next/next/no-img-element */
import Privacy from "@/components/layouts/Privacy";
import Button from "@/components/ui/buttons/Button";
import Text from "@/components/ui/Texts/Text";
import Link from "next/link";

const LoginSignup = () => {
  return (
    <>
      <div className="h-screen overflow-y-hidden font-inter">
        <div className="flex min-h-full flex-1">
          <div className="lg:hidden fixed top-0 left-0 p-4 z-50">
            <img src="/small_screen_logo.svg" alt="logo" />
          </div>
          <div className="md:w-7/12 lg:w-5/12 border-r-1 border-solid border-Golden-Yellow bg-gradient-to-br  from-Purple-Grad-Dark-900 to-Purple-Grad-Dark-500 relative hidden flex-1 lg:block">
            <div className="flex flex-col h-full p-6">
              <div>
                <img src="/logo.svg" alt="logo"/>
              </div>
              <div className="flex flex-col  h-full items-center   justify-end ">
                <div className="w-full  ">
                  <Text
                    variant="h1"
                    extraCSS="text-primaryWhite font-sans font-bold"
                  >
                    WOW your audience
                  </Text>
                  <Text variant="h2" extraCSS="text-primaryWhite font-light">
                    with simple, fun, conversational polls
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="w-5/12 2xl:w-7/12 grow flex flex-1 flex-col gap-y-8 justify-center  sm:px-6 lg:flex-none ">
            <div className="mx-auto w-full max-w-sm lg:w-72 flex flex-col gap-y-8">
              <div>
                <img
                  className="h-32 w-auto"
                  src="/handshake.svg"
                  alt="Your Company"
                />
                <Text variant="h2">Get started</Text>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/signin">
                  <Button label="Log in" type="primaryBlack" fullWidth />
                </Link>

                <Link href="/signup">
                  <Button label="Sign up" type="outline" fullWidth />
                </Link>
              </div>
              <Privacy />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
