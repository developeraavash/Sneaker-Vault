import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import Spinner from "./spinner";
import { useAppDispatch } from "../hooks/reduxHook";
import { updateCartByValue } from "../features/cart/cartslice";
import { toast } from "sonner";
export default function AddToCartBtn({
  productId,
  quantity = 1,
}: {
  productId: number;
  quantity?: number;
}) {
  const UPDATE_CART = gql`
    mutation updateCart($productId: Int!, $quantity: Int!) {
      updateCart(productId: $productId, quantity: $quantity)
    }
  `;
  const [updateCart, { data, error, loading }] = useMutation(UPDATE_CART);
  const [showSpinner, setShowSpinner] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <button
      className={`border flex items-center justify-center border-black p-2`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSpinner(true);
        updateCart({
          variables: {
            productId,
            quantity,
          },
        })
          .then(() => {
            dispatch(updateCartByValue(quantity));
            toast.success("Item added to cart successfully");
          })
          .finally(() => {
            setShowSpinner(false);
          });
      }}
    >
      {showSpinner ? <Spinner /> : "Add to Cart"}
    </button>
  );
}
