import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import "tailwindcss/tailwind.css";
import PaginationOrder from "../components/OrderComponent/OrderPagination";

function Products() {
  // STATE
  const [dataProduct, setDataProduct] = useState(null);
  const [dataCategory, setDataCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // GET DATA

  const getCategory = async () => {
    Axios.get(`${API_URL}/apis/product/category`).then((response) => {
      setDataCategory(response.data);
    });
  };

  const getProduct = async () => {
    try {
      let products = await Axios.post(API_URL + `/apis/product/listproduct`, {
        search,
        category: selectedCategory,
        order,
        limit,
        page: parseInt(page) - 1,
        minPrice,
        maxPrice,
      });
      setPage(products.data.page + 1);
      setDataProduct(products.data.data);
      setLastPage(products.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  let dataProductExist = false;
  if (dataProduct == null) {
    dataProductExist = false;
  } else {
    dataProductExist = true;
  }

  const [onFilter, setOnFilter] = useState(false);

  const onSetFilter = () => {
    if (
      search != "" ||
      selectedCategory != "" ||
      order != 0 ||
      minPrice != "" ||
      maxPrice != ""
    ) {
      setPage(1);
      setOnFilter(true);
      getProduct();
    }
  };

  const onResetFilter = () => {
    setSearch("");
    setSelectedCategory("");
    setOrder(0);
    setMinPrice("");
    setMaxPrice("");
    setOnFilter(false);
  };

  //USE EFFECT
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getProduct();
  }, [page, limit, onFilter]);

  //PRINT DATA
  const printCategory = () => {
    let data = dataCategory;
    if (dataCategory) {
      return data.map((val, idx) => {
        return (
          <option
            value={val?.id_category}
            selected={val.id_category == selectedCategory}
          >
            {val?.category}
          </option>
        );
      });
    }
  };

const printData = () => {
  let data = dataProductExist ? dataProduct : [];
  return (
    <div className="tw-mt-6 tw-grid tw-grid-cols-1 tw-gap-x-6 tw-gap-y-10 sm:tw-grid-cols-2 md:tw-grid-cols-4 xl:tw-gap-x-8">
      {data.map((val, idx) => {
        let detailproduct = `/product/detail/${val.id_product}`;
        return (
          <div key={val.id_product} className="tw-group tw-relative tw-flex tw-flex-col">
            <div className="tw-min-h-80 tw-aspect-h-1 tw-aspect-w-1 tw-w-full tw-overflow-hidden tw-rounded-md tw-bg-gray-200 lg:tw-aspect-none tw-group-hover:tw-opacity-75 lg:tw-h-80">
              <img
                src={`${API_URL}/img/product/${val.product_picture}`}
                alt={val.name}
                className="tw-h-full tw-w-full tw-object-cover tw-object-center lg:tw-h-full lg:tw-w-full"
              />
            </div>
            <div className="tw-mt-4 tw-flex tw-justify-between tw-flex-grow tw-grid tw-grid-rows-[auto,1fr,auto]">
              <div className="tw-row-span-1">
                <h3 className="tw-text-sm tw-text-gray-850">
                  <Link to={detailproduct}>
                    <span
                      aria-hidden="true"
                      className="tw-absolute tw-inset-0"
                    />
                    {val.name}
                  </Link>
                </h3>
              </div>
              <div className="tw-row-span-1">
                <p className="tw-mt-1 text-lg font-medium text-gray-950">{`Rp. ${Number(
                  val.price
                ).toLocaleString("id-ID")}`}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};


  return (
    <div className="tw-bg-white tw-w-full tw-m-auto">
      <div>
        <h2 className="tw-text-2xl">Daftar Produk</h2>
      </div>
      <div className="tw-flex tw-items-start tw-w-full">
        <div className="tw-col-span-9 tw-rounded tw-p-3">
          <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-3 tw-gap-x-6 tw-gap-y-10">
            {printData()}
          </div>
          <div className="tw-flex tw-my-5 tw-justify-center tw-items-center">
          <PaginationOrder
              currentPage={parseInt(page)}
              totalPages={parseInt(lastPage)}
              onPageChange={setPage}
              maxLimit={0}
            />
            <div className="tw-flex tw-mx-5 tw-items-center">
              menampilkan
              <input
                type="text"
                className="tw-form-input tw-ml-2 tw-mr-2 tw-w-16"
                placeholder="limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
              barang
            </div>
          </div>
        </div>
        <div className="tw-col-span-3 tw-rounded tw-shadow-md tw-p-3 filterbox tw-mt-10">
          <div>Filter</div>
          <div className="inputfilter">
            <input
              type="text"
              className="tw-form-input tw-mt-3 tw-w-full"
              placeholder="Cari nama produk"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="inputfilter">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="tw-form-select tw-mt-3 tw-w-full"
            >
              <option value="">Semua Kategori</option>
              <option value={0}>Kategori Nihil</option>
              {printCategory()}
            </select>
          </div>
          <div className="inputfilter">
            <select
              onChange={(e) => setOrder(e.target.value)}
              className="tw-form-select tw-mt-3 tw-w-full"
            >
              <option value={0}>Urutkan</option>
              <option value={1} selected={order == 1}>
                Nama:A-Z
              </option>
              <option value={2} selected={order == 2}>
                Nama:Z-A
              </option>
              <option value={3} selected={order == 3}>
                Harga Terendah
              </option>
              <option value={4} selected={order == 4}>
                Harga Tertinggi
              </option>
            </select>
          </div>
          <div className="inputfilter">
            <input
              type="text"
              className="tw-form-input tw-mt-3 tw-w-full"
              placeholder="harga min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="inputfilter">
            <input
              type="text"
              className="tw-form-input tw-mt-3 tw-w-full"
              placeholder="harga max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <br />
          <div className="tw-flex tw-space-x-2">
            <button
              type="button"
              className="tw-bg-orange-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded tw-shadow"
              onClick={() => onSetFilter()}
            >
              Set Filter
            </button>
            <button
              type="button"
              className={`tw-font-semibold tw-py-2 tw-px-4 tw-rounded tw-shadow ${
                onFilter
                  ? "tw-bg-orange-500 tw-text-white"
                  : "tw-border tw-border-orange-500 tw-text-orange-500"
              }`}
              onClick={() => onResetFilter()}
              disabled={!onFilter}
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
