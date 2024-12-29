import ProductCard from "./ProductCard";

const AllProducts = () => {
  const products = [
    {
      ProductName: "just another product",
      CurrentPrice: 500,
      Mrp: 1000,
      Rating: "4.5",
      off: "50% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 800,
      Mrp: 1200,
      Rating: "4.0",
      off: "33% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
    {
      ProductName: "just another product",
      CurrentPrice: 1200,
      Mrp: 1500,
      Rating: "4.8",
      off: "20% OFF",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          ProductName={product.ProductName}
          CurrentPrice={product.CurrentPrice}
          Mrp={product.Mrp}
          Rating={product.Rating}
          Offer={product.off}
        />
      ))}
    </div>
  );
};

export default AllProducts;
