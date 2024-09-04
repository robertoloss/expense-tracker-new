'use server'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export const actionSignOut = async () => {
	'use server'
	const supabase = createClient();
	await supabase.auth.signOut();
	return redirect("/login");
};

