"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeButton, setTypeButton] = useState<string>("add");

  const fetchProducts = () => {
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase();
    const searchTermNumber = parseInt(searchTerm, 10);
    const results = products.filter((product) =>
      searchTermNumber
        ? product.id === searchTermNumber
        : product.productName.toLowerCase().includes(searchTermLower)
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const [formAddOrUpdate, setFormAddOrUpdate] = useState<Product>({
    id: 0,
    productName: "",
    price: 0,
    image: "",
    quantity: 0,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormAddOrUpdate((prev) => ({
      ...prev,
      [id]: id === "quantity" || id === "price" ? Number(value) : value,
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleEdit = (id: number) => {
    const productToEdit = products.find((product) => product.id === id);
    if (productToEdit) {
      setFormAddOrUpdate(productToEdit);
      setTypeButton("edit");
    }
  };

  const handleAddorUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeButton === "add") {
      axios
        .post("http://localhost:3000/api/products", formAddOrUpdate)
        .then((response) => {
          console.log(response.data.message);
          fetchProducts();
          setFormAddOrUpdate({
            id: 0,
            productName: "",
            price: 0,
            image: "",
            quantity: 0,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (typeButton === "edit") {
      const confirmed = window.confirm(
        "Bạn có chắc muốn cập nhật sản phẩm này không?"
      );
      if (confirmed) {
        axios
          .put(
            `http://localhost:3000/api/products/${formAddOrUpdate.id}`,
            formAddOrUpdate
          )
          .then((response) => {
            console.log(response.data.message);
            fetchProducts();
            setFormAddOrUpdate({
              id: 0,
              productName: "",
              price: 0,
              image: "",
              quantity: 0,
            });
            setTypeButton("add");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này không?"
    );
    if (confirmed) {
      axios
        .delete(`http://localhost:3000/api/products/${id}`)
        .then((response) => {
          fetchProducts();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên hoặc ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mb-4"
        />
        <div className="flex gap-4">
          <table className="text-center w-3/4 border">
            <thead>
              <tr>
                <th className="border">STT</th>
                <th className="border">Tên sản phẩm</th>
                <th className="border">Hình ảnh</th>
                <th className="border">Giá</th>
                <th className="border">Số lượng</th>
                <th className="border">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border">{index + 1}</td>
                  <td className="border">{product.productName}</td>
                  <td className="flex justify-center border">
                    <img className="w-96 h-56 " src={product.image} alt="" />
                  </td>
                  <td className="border">{formatCurrency(product.price)}</td>
                  <td className="border">{product.quantity}</td>
                  <td className="border">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="bg-zinc-400 p-1 me-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white p-1 me-3"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <form
              action=""
              className="flex flex-col"
              onSubmit={handleAddorUpdate}
            >
              <h1 className="text-center">Thêm mới sản phẩm</h1>
              <label htmlFor="productName">Tên</label>
              <input
                id="productName"
                className="border"
                type="text"
                value={formAddOrUpdate.productName}
                onChange={handleOnChange}
              />
              <label htmlFor="image">Hình ảnh</label>
              <input
                id="image"
                className="border"
                type="text"
                value={formAddOrUpdate.image}
                onChange={handleOnChange}
              />
              <label htmlFor="price">Giá</label>
              <input
                id="price"
                className="border"
                type="number"
                value={formAddOrUpdate.price}
                onChange={handleOnChange}
              />
              <label htmlFor="quantity">Số lượng</label>
              <input
                id="quantity"
                className="border"
                type="number"
                value={formAddOrUpdate.quantity}
                onChange={handleOnChange}
              />
              <button type="submit" className="bg-blue-600 text-white mt-2">
                {typeButton === "add" ? "Thêm" : "Cập nhật"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
