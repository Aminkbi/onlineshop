import { getCart } from "@/lib/db/cart";
import Link from "next/link";
import { redirect } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function searchProducts(formData: FormData) {
  "use server";
  const searchQuery = formData.get("searchQuery")?.toString();

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const cart = await getCart();
  return (
    <div className="bg-base-300">
      <div className="navbar m-auto max-w-7xl flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost text-xl normal-case">
            NexShop
          </Link>
        </div>
        <div className="mt-12 flex-col-reverse gap-4 sm:mt-0 sm:flex-row">
          <div className="form-control">
            <form action={searchProducts}>
              <input
                name="searchQuery"
                type="text"
                placeholder="Search"
                className="input input-bordered w-full sm:w-24 md:w-auto"
              />
            </form>
          </div>
          <ShoppingCartButton cart={cart} />
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}
