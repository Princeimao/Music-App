import { RegisterForm } from "@/components/forms/RegisterForm";
import logo from "../Logo.svg";

const RegisterPage = () => {
  return (
    <div className="bg-[#181818] text-white flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <img src={logo} alt="Logo" />
          </div>
          TuneSync
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
