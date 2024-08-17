import { useEffect, useState } from "react";
import FeaturedProducts from "./featured";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import { addToCart, removeFromCart } from "../../features/cart/cartslice";
import { gql, useMutation, useQuery } from "@apollo/client";
import BuyBtn from "../../ui/buyBtn";
import Delete from "../../ui/delete";
import Error from "../error";
export default function Cart() {
  const GET_CART_ITEMS = gql`
    query getCartItems {
      getCartItems(userId: 4) {
        id
        quantity
        product {
          id
          name
          price
          images {
            id
            url
          }
        }
      }
      getFeaturedProducts {
        id
        price
        name
        url
        images {
          url
        }
      }
    }
  `;

  interface P {
    id: number;
    quantity: number;
    product: Product;
  }
  const { error, data, loading, refetch } = useQuery<{
    getCartItems: P[];
    getFeaturedProducts: Product[];
  }>(GET_CART_ITEMS);

  const cartValue = useAppSelector((state) => state.cart.value);
  const [cartI,setCartI] = useState<P[]>([])
  const [cartItems,setCartItems] = useState<{id:number,quantity:number}[]>([])
  async function fetchCartItems() {
    const res = await refetch();
    if(res.data){
      setCartI(res.data.getCartItems)
    }
  }
  useEffect(()=>{
    fetchCartItems()
  },[cartValue])
  useEffect(()=>{
    if(data){
      setCartI(data.getCartItems)
      const p = cartI.map((item)=>{
          return {
            id:item.product.id,
            quantity:item.quantity
          }
      })
      setCartItems(p)
    }
  },[data,cartI])

  if (error) {
    return <Error/>;
  }
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="flex p-4 flex-col gap-y-4 text-sm items-center justify-center">
      {
        cartI && cartI.length === 0  && 
        <div>
          <h5 className="font-semibold text-white bg-gray-700 px-4 py-2">Your cart is empty</h5>
      </div>
      }
        
      <div className="flex w-full max-w-[800px] flex-col gap-y-4">
        {cartI &&
          cartI?.map(({ id, quantity, product }, i) => (
            <ProductCartCard
              id={id}
              quantity={quantity}
              product={product}
              key={i}
            />
          ))}
      </div>
      {cartItems && cartItems.length > 0 && (
        <div className="w-full max-w-[800px] text-end">
          <div className="">
            <BuyBtn label="Checkout" products={cartItems || []} />
          </div>
        </div>
      )}
      {data && data.getFeaturedProducts && (
        <FeaturedProducts products={data.getFeaturedProducts} />
      )}
    </div>
  );
}

interface ProductCartCard {
  id: number;
  quantity: number;
  product: Product;
}

function ProductCartCard({ id, quantity: quan, product }: ProductCartCard) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(quan);
  const ADD_TO_CART = gql`
    mutation updateCart($productId: Int!, $quantity: Int!) {
      updateCart(productId: $productId, quantity: $quantity)
    }
  `;
  const DElETE_FROM_CART = gql`
    mutation updateCart($itemId: Int!) {
      deleteItemFromCart(itemId: $itemId)
    }
  `;
  const [updateCart] = useMutation(ADD_TO_CART);
  const [deleteItemFromCart] = useMutation(DElETE_FROM_CART);
  return (
    <div className="w-full items-center flex gap-x-2">
      <img className="w-[100px]" src={product.images[0].url} alt="" />
      <div className="flex flex-1 flex-col">
        <p className="font-semibold">{product.name}</p>
        <span>Price: {product.price}</span>
        {/* <span>Size: {product.}</span> */}
      </div>
      <div className="flex-1 flex items-center">
        <div
          style={{ width: "max-content" }}
          className="border flex items-center border-gray-500 gap-x-4 px-4 py-2"
        >
          <button
            onClick={() => {
              if (quantity > 1) {
                dispatch(removeFromCart());
                updateCart({
                  variables: {
                    productId: product.id,
                    quantity: -1,
                  },
                });
                setQuantity((prev) => {
                  if (prev > 1) return prev - 1;
                  return prev;
                });
              }
            }}
          >
            -
          </button>
          <span className="text-xs">{quantity}</span>
          <button
            onClick={() => {
              dispatch(addToCart());
              updateCart({
                variables: {
                  productId: product.id,
                  quantity: 1,
                },
              });
              setQuantity((prev) => prev + 1);
            }}
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() =>
          deleteItemFromCart({
            variables: { itemId: id },
          })
        }
        className="text-xs px-2 py-1"
      >
        <Delete/>
      </button>
      <div>
        <span>NPR{product.price * quantity}</span>
      </div>
    </div>
  );
}
