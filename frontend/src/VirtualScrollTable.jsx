import React, { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import "./VirtualScrollTable.css";

const ROW_HEIGHT = 200;
const VISIBLE_ROWS = 20;

const VirtualScrollTable = () => {
  const containerRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [sortDirection, setSortDirection] = useState("asc");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `https://assignment-1-ftvv.onrender.com/api/orders?cursor=${pageParam}&limit=50`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const flatData = data?.pages.flatMap((page) => page.data) || [];

  const sortedData = [...flatData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a.orderAmount - b.orderAmount;
    } else {
      return b.orderAmount - a.orderAmount;
    }
  });

  const handleScroll = () => {
    if (containerRef.current) {
      const offset = containerRef.current.scrollTop;
      setScrollOffset(offset);

      if (
        containerRef.current.scrollHeight - offset <=
          containerRef.current.clientHeight * 2 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    }
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!flatData.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="virtual-table">
     
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "blue",
          gap: "20rem",
        }}
      >
        <h1>Customer</h1>
        <h1>
          Amount
          <button
            onClick={toggleSortDirection}
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              padding: "5px 10px",
              background: "blue",
              color: "white",
              borderRadius: "5px",
              border: "none",
            }}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </h1>
        <h1>Status</h1>
      </div>

      <div
        ref={containerRef}
        className="table-container"
        onScroll={handleScroll}
        style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}px`, overflowY: "auto" }}
      >
        <div style={{ height: `${sortedData.length * ROW_HEIGHT}px` }}>
          {sortedData.map((row, index) => (
            <div
              key={row.id}
              style={{
                position: "absolute",
                top: `${index * ROW_HEIGHT}px`,
                height: `${ROW_HEIGHT}px`,
                width: "100%",
                margin: "20px",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "24rem",
              }}
              className="table-data"
            >
              <h2>{row.customerName}</h2>
              <h2 style={{ color: "gray" }}>{row.orderAmount}</h2>
              <h3 style={{ color: "gray" }}>{row.status}</h3>
            </div>
          ))}
        </div>
      </div>

      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
};

export default VirtualScrollTable;
