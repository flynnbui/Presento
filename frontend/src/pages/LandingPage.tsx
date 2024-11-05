import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
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
          <h1 className="font-bold text-2xl leading-10">Another powerful presentation tool</h1>
          <h2 className="leading-7 text-gray-900">Create stunning presentations effortlessly with beautifully crafted slides, ready to captivate any audience.</h2>

          {/* Get Started Button */}
          <div className="flex">
            <Button className="dark:bg-zinc-900 dark:text-zinc-50 shadow dark:hover:bg-zinc-900/90 " onClick={() => navigate("/dashboard")}>Get started</Button>
          </div>
        </div>
      </div>

      {/* Login Button */}
      <div className="flex flex-row space-x-2 row-start-1 col-start-8 md:col-start-10 lg:col-start-11 col-span-2 my-auto ">
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button onClick={() => navigate("/register")}>Register</Button>
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
