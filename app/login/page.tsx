import LoginPage from "@/components/contents/login";
import { poppins } from "@/styles/font";

export default function Login() {
  return (
    <main className={`z-[4] ${poppins.className} bg-black`}>
      <LoginPage/>
    </main>
  );
}