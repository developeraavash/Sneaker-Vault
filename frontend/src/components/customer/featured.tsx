import ProductCard from "../productCard";

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="px-4 py-8 flex flex-col gap-y-2 ">
      <h5 className="font-semibold">Featured Products</h5>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product, i) => (
          <Product {...product} key={i} />
        ))}
      </div>
    </div>
  );
}

function Product(props: Product) {
  return <ProductCard {...props} />;
}
