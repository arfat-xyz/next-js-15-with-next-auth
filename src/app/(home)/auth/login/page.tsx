import LoginForm from "@/components/auth/forms/loginForm";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-70px)] w-full items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
