import { Link, useNavigate } from "react-router-dom";
import Search from "../search";
import Person from "../person";
import Bag from "../bag";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHook";
import AppLogo from "../logo";
import { useQuery, gql, ApolloError } from "@apollo/client";
import { useEffect, useState } from "react";
import { setInitCartValue } from "../../features/cart/cartslice";
export default function Navbar() {
  const [keyword, setKeyword] = useState("");
  const searchProduct = gql`
    query searchProduct($keyword: String!) {
      searchProduct(keyword: $keyword) {
        id
        name
        url
        images {
          url
        }
      }
    }
  `;
  const { data, loading, error } = useQuery<{
    searchProduct: Product[];
  }>(searchProduct, {
    variables: { keyword },
    skip: !keyword,
  });
  const GET_CART_VALUE = gql`
    query getCartValue {
      getCartValue
    }
  `;
  const { data: cartData } = useQuery<{ getCartValue: number }>(GET_CART_VALUE);
  useEffect(() => {
    return () => {
      setKeyword("");
    };
  }, []);
  const dispatch = useAppDispatch();
  const cartValue = useAppSelector((state) => state.cart.value);
  useEffect(() => {
    if (cartData && cartData.getCartValue) {
      dispatch(setInitCartValue(cartData.getCartValue));
    }
  }, [cartData]);
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full gap-x-4 items-center justify-center">
        <AppLogo />
        <div className="flex items-center gap-x-2">
          <div className="relative border p-2 flex items-center w-full">
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.currentTarget.value);
              }}
              placeholder="Search..."
              className="focus:outline-none text-sm"
            />
            <button className="hover:bg-gray-200 rounded-full p-1">
              <Search />
            </button>
            {data && data.searchProduct && keyword && (
              <SearchedProducts
                products={data.searchProduct}
                loading={loading}
                error={error}
              />
            )}
          </div>
          <Link className="hover:bg-gray-200 rounded-full p-1" to={"/profile"}>
            <Person />
          </Link>
          <Link className="hover:bg-gray-200 rounded-full p-1" to={"/cart"}>
            <div className="relative">
              <Bag />
              <div className="absolute bg-gray-700 text-white -right-2 rounded-full px-1 text-xs top-3">
                {cartValue}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface Product {
  id: number;
  name: string;
  url: string;
  images: [{ url: string }];
}

function SearchedProducts(props: {
  products: Product[];
  loading: boolean;
  error?: ApolloError;
}) {
  const navigate = useNavigate();
  if (props.error) return <div>Error</div>;
  if (props.loading) return <div>Loading...</div>;
  return (
    <div className="flex max-h-[400px] overflow-auto flex-col gap-y-2 text-sm absolute bg-white z-50 top-14 border shadow w-full left-0">
      {props.products &&
        props.products.map((product, i) => (
          <div
            onClick={() => {
              navigate(`/product/${product.id}`);
            }}
            className="p-2 flex items-center gap-x-2 hover:bg-gray-100 cursor-pointer"
            key={i}
          >
            <img className="w-[50px]" src={product.images[0].url} />
            {product.name}
          </div>
        ))}
    </div>
  );
}
