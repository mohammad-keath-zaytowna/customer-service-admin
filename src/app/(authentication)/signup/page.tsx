import signupImg from "public/assets/signup.jpg";

import AuthFormTemplate from "@/components/shared/auth/AuthFormTemplate";
import SignupForm from "./_components/SignupForm";

export default function Page() {
  return (
    <AuthFormTemplate image={signupImg}>
      <SignupForm />
    </AuthFormTemplate>
  );
}
