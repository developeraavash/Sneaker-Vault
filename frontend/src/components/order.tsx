import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import Error from "./error";

interface Product {
  name: string;
  images: {
    url: string;
  }[];
}
interface Item {
  productId: number;
  price: number;
  quantity: number;
  product: Product;
}
interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items: Item[];
}

export default function Order() {
  const GET_ORDERS = gql`
    query getOrders {
      getOrders {
        id
        total
        status
        createdAt
        items {
          productId
          price
          quantity
          product {
            name
            images {
              url
            }
          }
        }
      }
    }
  `;

  const { data, error, loading } = useQuery<{
    getOrders: Order[];
  }>(GET_ORDERS);
  if (error) {
    return <Error/>
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex items-center w-full text-sm text-gray-700 justify-center">
      <div className="gap-y-2 max-w-[500px] w-full items-center justify-center flex flex-col">
        <h5 className="w-full font-semibold">Your Orders</h5>
        <div className="flex flex-col w-full gap-y-4">
          {data &&
            data.getOrders &&
            data.getOrders.map((order, i) => (
              <OrderCard orders={order} key={i} />
            ))}
        </div>
      </div>
    </div>
  );
}

function OrderCard(props: { orders: Order }) {
  const [showItems, setShowItems] = useState(false);
  const [btnLabel, setBtnLabel] = useState("Show items");
  return (
    <div className="border bg-gray-100 p-2">
      <div className="flex items-center gap-x-4">
        <p>
          OrderId: <span className="font-semibold">{props.orders.id}</span>
        </p>
        <p>
          Status: <span className="font-semibold">{props.orders.status}</span>
        </p>
        <p>
          Total: Rs<span className="font-semibold">{props.orders.total}</span>
        </p>
      </div>
      <div>
        <button
          onClick={() => {
            setShowItems((p) => !p);
            setBtnLabel(() => (showItems ? "Show items" : "Hide Items"));
          }}
          className="text-xs mb-2 bg-gray-200 hover:bg-gray-300 p-2 "
        >
          {btnLabel}
        </button>
        {showItems && (
          <div className="flex flex-col gap-y-2">
            {props.orders.items.map(({ price, product, quantity }, i) => (
              <div
                className="flex border p-2 justify-between gap-x-2 items-center"
                key={i}
              >
                <div className="flex items-center gap-x-2">
                  <img
                    className="w-[60px]"
                    src={product.images[0].url}
                    alt=""
                  />
                  <div className="flex flex-col">
                    {product.name}
                    <span>{price}</span>
                  </div>
                </div>
                <div>
                  Quantity:
                  <span>{quantity}</span>
                </div>
                <div>Rs{price * quantity}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
