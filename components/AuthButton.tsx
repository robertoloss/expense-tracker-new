import Link from "next/link";
import { actionSignOut } from "@/app/actions/signOut";

export default function AuthButton() {

  return true ? (
    <div className="flex items-center gap-4">
      Hey!
      <form action={actionSignOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
