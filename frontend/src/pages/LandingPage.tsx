import { Button } from "@/components/ui/button";

function LandingPage() {
  return (
    <>
    <div className="w-screen h-screen grid grid-rows-10 grid-cols-12">
      {/* Main Title */}
      <h1 className="text-xl font-bold text-white m-auto">Presto</h1>

      {/* Gradient Background Section */}
      <div
        className="grid grid-cols-9 col-start-2 col-span-10 row-start-2 row-span-4 rounded-lg
        bg-gradient-to-r from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff]
        bg-200% animate-gradientShift"
      >
        {/* Content Container */}
        <div className="flex flex-col col-start-2 col-span-5 space-y-4 justify-center">
          <h1 className="font-bold text-2xl leading-10">Another yet powerful presentation tool</h1>
          <h2 className="leading-7 text-gray-900">Create stunning presentations effortlessly with beautifully crafted slides, ready to captivate any audience.</h2>

          {/* Get Started Button */}
          <div className="flex">
            <Button>Get started</Button>
          </div>
        </div>
      </div>

      {/* Login Button */}
      <div className="row-start-1 col-start-9 md:col-start-10 col-span-2 m-auto">
        <Button>Login</Button>
      </div>

      {/* Register Button */}
      <div className="row-start-1 col-start-11 col-span-2 m-auto">
        <Button>Register</Button>
      </div>
      <div className="text-center text-white row-start-6 col-span-full">
        <p className="text-center text-gray-500 text-sm mt-2">
          &copy; {new Date().getFullYear()} Made by Flynn & Zyler.
        </p>
      </div>
    </div>
    </>
  );
}

export default LandingPage;
