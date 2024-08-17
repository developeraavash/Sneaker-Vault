import { gql, useQuery } from "@apollo/client";
import ProductCard from "../productCard";
import { useEffect, useRef } from "react";

export default function Collections() {
  const GET_PRODUCTS = gql`
    query getProducts($first: Int!, $after: String!) {
      getProducts(first: $first, after: $after) {
        products {
          id
          name
          description
          price
          url
          stock
          images {
            url
          }
        }
        metaData {
          hasNextPage
          lastCursor
        }
      }
    }
  `;
  const { loading, error, data, fetchMore } = useQuery<{
    getProducts: {
      products: Product[];
      metaData: { hasNextPage: boolean; lastCursor: number };
    };
  }>(GET_PRODUCTS, {
    variables: {
      first: 8,
      after: "1",
    },
  });
  function loadMore() {
    fetchMore({
      variables: {
        first: 8,
        after: data?.getProducts.metaData.lastCursor.toString() || "1",
      },
    });
  }
  useEffect(() => {
    function handleDocScroll(e: Event) {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight
      ) {
        console.log(data?.getProducts.metaData, "meta data");
        if (data?.getProducts.metaData.hasNextPage) {
          console.log("loading more");
          loadMore();
        }
      }
    }
    document.addEventListener("scroll", handleDocScroll);
    return () => {
      document.removeEventListener("scroll", handleDocScroll);
    };
  }, [data]);
  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    const pulseCardNum = new Array(20).fill(0);
    return (
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4">
          {pulseCardNum.map((i, j) => (
            <PulseCard key={j} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex text-sm items-center justify-center">
      <div className=" sm:grid-cols-2 grid md:grid-cols-3 gap-4">
        {data &&
          data.getProducts &&
          data.getProducts.products.map((product: Product, i: number) => (
            <ProductCard {...product} key={i} />
          ))}
      </div>
    </div>
  );
}

function PulseCard() {
  return (
    <div className="rounded-md p-4 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex-col flex space-x-4">
        <div className="bg-gray-200 h-[240px] w-[200px]"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-gray-200 "></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-200  col-span-2"></div>
              <div className="h-2 bg-gray-200  col-span-1"></div>
            </div>
            <div className="h-2 bg-gray-100 "></div>
          </div>
        </div>
      </div>
    </div>
  );
}
