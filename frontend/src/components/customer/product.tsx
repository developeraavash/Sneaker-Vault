import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import BuyBtn from "../../ui/buyBtn";
import FeaturedProducts from "./featured";
import { useAppDispatch } from "../../hooks/reduxHook";
import { updateCartByValue } from "../../features/cart/cartslice";
import AddToCartBtn from "../../ui/addToCartBtn";
export default function Product() {
  const [quantity, setQuantity] = useState(1);
  const param = useParams();

  const getProduct = gql`
        query getProduct{
         getProduct(id:${param.id}) {
            id
            name
            description
            price
            stock
            images{
                url
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
  const { data, loading, error } = useQuery<{
    getProduct: {
      id: number;
      name: string;
      description: string;
      images: {
        url: string;
      }[];
      price: number;
      stock: number;
    };
    getFeaturedProducts: Product[];
  }>(getProduct);
  const [featuredImg, setFeaturedImg] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data) setFeaturedImg(data?.getProduct.images[0].url);
  }, [data]);
  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex p-4 flex-col">
      <div className="flex gap-x-4 text-sm justify-center">
        <div className="flex gap-x-4 ">
          <div className="">
            {data &&
              data.getProduct.images.map(({ url }, i) =>
                url.endsWith(".mov") || url.endsWith(".mp4") ? (
                  <video
                    onMouseEnter={() => {
                      setIsVideo(true);
                      setFeaturedImg(() => url);
                    }}
                    className="w-[60px]"
                    src={url}
                  ></video>
                ) : (
                  <img
                    onMouseEnter={() => {
                      setIsVideo(false);
                      setFeaturedImg(() => url);
                    }}
                    className="w-[60px] cursor-pointer"
                    key={i}
                    src={url}
                    alt=""
                  />
                ),
              )}
          </div>
          <div>
            {isVideo ? (
              <video
                autoPlay
                className="max-w-[360px]"
                src={featuredImg}
              ></video>
            ) : (
              <img className="max-w-[360px]" src={featuredImg} />
            )}
          </div>
        </div>
        <div className="flex gap-y-2 flex-col">
          <div>
            <p className="font-semibold">{data?.getProduct.name}</p>
            <span className="font-semibold">NPR{data?.getProduct.price}</span>
          </div>
          <div>
            size
            <div></div>
          </div>
          <div className="flex flex-col gap-y-2">
            Quantity
            <div
              style={{ width: "max-content" }}
              className="flex gap-x-4 border border-black py-2 px-4 item-center justify-center"
            >
              <button
                onClick={() => {
                  setQuantity((prev) => {
                    if (prev > 1) return prev - 1;
                    return prev;
                  });
                }}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => {
                  setQuantity((prev) => {
                    return prev + 1;
                  });
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <AddToCartBtn
              productId={data?.getProduct.id || 0}
              quantity={quantity}
            />
            <BuyBtn
              label="Buy"
              products={[{id: data?.getProduct.id || 0, quantity: 1 }]}
            />
          </div>
          <div>
            <p>{data?.getProduct.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {data && data.getFeaturedProducts && (
          <FeaturedProducts products={data.getFeaturedProducts} />
        )}
      </div>
    </div>
  );
}
