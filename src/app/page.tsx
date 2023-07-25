import PaginationBar from "@/components/PaginationBar";
import PriceTag from "@/components/PriceTag";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface HomePageProps {
  searchParams: {
    page: string;
  };
}
export default async function Home({
  searchParams: { page = "1" },
}: HomePageProps) {
  const currentPage = parseInt(page);

  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = await prisma.product.count();
  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {currentPage === 1 && (
        <div className="hero rounded-xl bg-base-200 ">
          <Link
            href={`/product/${products[0].id}`}
            className="hero-content flex-col lg:flex-row"
          >
            <Image
              src={products[0].imageUrl}
              alt={products[0].name}
              width={800}
              height={600}
              className="w-full max-w-sm rounded-full shadow-2xl md:rounded-lg"
              priority
            />
            <div>
              <h1 className="text-5xl font-bold">{products[0].name}</h1>
              <p className="py-12 text-justify">{products[0].description}</p>
              <div className="flex items-center justify-center">
                <PriceTag
                  price={products[0].price}
                  className="h-16 w-36 text-lg font-bold "
                />
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(currentPage === 1 ? products.slice(1) : products).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
