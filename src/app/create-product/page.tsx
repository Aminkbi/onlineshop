import FormSubmitBtn from "@/components/FormSubmitBtn";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Add product",
  description: "Add a new product to the store",
};

async function addProduct(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }
  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
    },
  });
  redirect("/");
}
const AddProductPage = async () => {
  const session = await getServerSession(authOptions);
  const disabled = false;
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/create-product");
  }

  return (
    <>
      <h1 className="mb-3 mt-4 text-lg font-bold">Add product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          type="text"
          placeholder="Type here"
          className="input input-bordered mb-3 w-full"
        />
        <textarea
          required
          name="description"
          placeholder="Type here"
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          required
          name="imageUrl"
          type="url"
          placeholder="Type URL"
          className="input input-bordered mb-3 w-full"
        />
        {/* price input */}
        <input
          required
          name="price"
          type="number"
          placeholder="Type here"
          className="input input-bordered mb-3 w-full"
        />
        <FormSubmitBtn className=" btn-secondary btn-block mb-40">
          Add product
        </FormSubmitBtn>
      </form>
    </>
  );
};

export default AddProductPage;
