import { redirect } from "next/navigation";
import { URL } from "@/lib/constants/URL";

export default function HomePage() {
  redirect(URL.DASHBOARD_URL);
}
