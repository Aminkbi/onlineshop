import { format } from "@/lib/format";

interface PriceTagProps {
  price: number;
  className?: string;
}

const PriceTag = ({ price, className }: PriceTagProps) => {
  return <span className={`badge ${className}`}>{format(price)}</span>;
};

export default PriceTag;
