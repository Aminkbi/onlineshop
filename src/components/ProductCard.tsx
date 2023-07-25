import { Product } from "@prisma/client";
import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;
  return (
    <Link
      href={`/product/${product.id}`}
      className="card w-full bg-base-300 shadow-xl hover:scale-105 duration-500 ease-in-out "
    >
      <figure>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={800}
          height={400}
          className="h-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          {isNew && <span className="badge badge-secondary"> NEW!</span>}
        </h2>
        <p className="font-extralight text-justify">{product.description}</p>
        <PriceTag price={product.price} className="w-24 h-10" />
      </div>
    </Link>
  );
};

export default ProductCard;
