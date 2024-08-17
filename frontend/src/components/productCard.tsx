import { useAppDispatch } from "../hooks/reduxHook";
import { Link } from "react-router-dom";
import BuyBtn from "../ui/buyBtn";
import AddToCartBtn from "../ui/addToCartBtn";
interface Product {
  id: number;
  name: string;
  price: number;
  url: string;
  // stock:number
  images: [
    {
      url: string;
    },
  ];
}
export default function ProductCard(props: Product) {
  const dispatch = useAppDispatch();
  return (
    <Link to={`/product/${props.id}`}>
      <div className="flex cursor-pointer flex-col gap-y-2 max-w-[200px]">
        <img className="h-[240px] w-full" src={props.images[0].url} />
        <div className="flex items-center flex-col">
          <p className="truncate w-full text-center">{props.name}</p>
          <span>Price: {props.price}</span>
        </div>
        <div className="flex flex-col gap-y-2">
          <AddToCartBtn productId={props.id} />
          <BuyBtn label="Buy" products={[{ id: props.id, quantity: 1 }]} />
        </div>
      </div>
    </Link>
  );
}
