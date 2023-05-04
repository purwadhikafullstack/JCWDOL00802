import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const Paging = ({ first, second, third }) => {
  let page = parseInt(first);
  let lastPage = parseInt(second);
  const handleClick = (val) => {
    third(val);
  };

  return (
    <Pagination>
      {/* START */}
      <PaginationItem disabled={page == 1}>
        <PaginationLink
          className={page == 1 ? "disablePage" : "page"}
          first
          onClick={() => handleClick(1)}
        />
      </PaginationItem>
      <PaginationItem disabled={page == 1}>
        <PaginationLink
          className={page == 1 ? "disablePage" : "page"}
          onClick={() => handleClick(page - 1)}
          previous
        />
      </PaginationItem>
      {/* 2 HALAMAN SBLM */}
      <PaginationItem disabled={page - 2 <= 0}>
        <PaginationLink
          className={page - 2 <= 0 ? "disablePage" : "page"}
          onClick={() => handleClick(page - 2)}
        >
          {page - 2 <= 0 && <>...</>}
          {page - 2 > 0 && page - 2}
        </PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={page - 1 <= 0}>
        <PaginationLink
          className={page - 1 <= 0 ? "disablePage" : "page"}
          onClick={() => handleClick(page - 1)}
        >
          {page - 1 <= 0 && <>...</>}
          {page - 1 > 0 && page - 1}
        </PaginationLink>
      </PaginationItem>
      {/* CURRENT PAGE */}
      <PaginationItem disabled>
        <PaginationLink className="pageselected">{page}</PaginationLink>
      </PaginationItem>
      {/* 2 HALAMAN STLH */}
      <PaginationItem disabled={page + 1 > lastPage}>
        <PaginationLink
          className={page + 1 > lastPage ? "disablePage" : "page"}
          onClick={() => handleClick(page + 1)}
        >
          {page + 1 > lastPage && <>...</>}
          {page + 1 <= lastPage && page + 1}
        </PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={page + 2 > lastPage}>
        <PaginationLink
          className={page + 2 > lastPage ? "disablePage" : "page"}
          onClick={() => handleClick(page + 2)}
        >
          {page + 2 > lastPage && <>...</>}
          {page + 2 <= lastPage && page + 2}
        </PaginationLink>
      </PaginationItem>
      {/* END */}
      <PaginationItem disabled={page == lastPage}>
        <PaginationLink
          className={page == lastPage ? "disablePage" : "page"}
          onClick={() => handleClick(page + 1)}
          next
        />
      </PaginationItem>
      <PaginationItem disabled={page == lastPage}>
        <PaginationLink
          className={page == lastPage ? "disablePage" : "page"}
          onClick={() => handleClick(lastPage)}
          last
        />
      </PaginationItem>
    </Pagination>
  );
};

export default Paging;
