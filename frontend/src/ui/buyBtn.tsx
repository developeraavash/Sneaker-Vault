import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
export default function BuyBtn(props: {
  label: string;
  products: { id: number; quantity: number}[];
}) {
  const [products, setProducts] = useState<{ id: number; quantity: number }[]>(
    [],
  );

  useEffect(() => {
      setProducts(props.products);
  }, [props.products]);
  const GET_CHECKOUT_URL = gql`
    query getCheckoutUrl($products: [CheckoutProduct]) {
      getCheckoutUrl(products: $products)
    }
  `;
  const [getCheckoutUrl, { data, error, loading }] = useLazyQuery<{
    getCheckoutUrl: string;
  }>(GET_CHECKOUT_URL);

  useEffect(() => {
    if (data && data.getCheckoutUrl) {
      window.location.href = data.getCheckoutUrl;
    }
  }, [data]);
  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        getCheckoutUrl({
          variables: {
            products,
          },
        });
      }}
      className="text-white bg-gray-800 p-2 px-8"
    >
      {props.label}
    </button>
  );
}
