import { getCart } from "@/lib/db/cart";
import { format } from "@/lib/format";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";

export const metadata = {
  title: "Your Cart",
  description: "Your shopping cart",
};

export default async function CartPage() {
  const cart = await getCart();
  return (
    <div className="flex flex-col items-center  w-full p-4">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          cartItem={cartItem}
          key={cartItem.id}
          setProductQuantity={setProductQuantity}
        />
      ))}
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-center w-full">
        <p className="mb-3 font-bold">Total: {format(cart?.subtotal || 0)}</p>
        <button className="btn-secondary btn w-full max-w-xl ">Checkout</button>
      </div>
      {!cart?.items.length && <p className="mb-60"></p>}
    </div>
  );
}
