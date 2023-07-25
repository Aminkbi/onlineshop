"use client";

import { CartItemWithProduct } from "@/lib/db/cart";
import { format } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const [isPending, startTransition] = useTransition();

  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap flex-col sm:flex-row items-center gap-3">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={200}
          className="rounded-xl mr-6"
        />
        <div className="flex flex-col items-center sm:w-300px justify-center w-[400px]">
          <Link href={"/products/" + product.id} className="font-bold text-lg">
            {product.name}
          </Link>
          <div className="badge-accent badge rounded">
            Price: {format(product.price)}
          </div>

          <div className="my-1 mt-8 flex items-center gap-2">
            Quantity:
            <select
              className="select-bordered select w-full max-w-[80px]"
              defaultValue={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                startTransition(async () => {
                  await setProductQuantity(product.id, newQuantity);
                });
              }}
            >
              <option value={0}>0 (Remove)</option>
              {quantityOptions}
            </select>
          </div>
          <div className="flex items-center gap-3">
            Total: {format(product.price * quantity)}
            {isPending && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </div>
        </div>
      </div>
      <div className="divider max-w-lg my-10" />
    </div>
  );
}
