import AuthService from "@/services/auth";
import { useEffect } from "react";
import Router from "next/router";

const Home = () => {
  useEffect(() => {
    setTimeout(async () => {
      try {
        await AuthService.verify();
        Router.replace("/admin");
      } catch (error) {
        console.log(error);

        Router.replace("/login");
      }
    }, 1000);
  });

  return (
    <div className="flex h-screen justify-center overflow-hidden ">
      <div className="text-center m-auto">
        <div className="flex justify-center items-center space-x-2">
          <div className="flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
