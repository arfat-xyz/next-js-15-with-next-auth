import RegisterForm from "@/components/auth/forms/register-form";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-70px)] w-full items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
