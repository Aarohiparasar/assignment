import React, { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import "./VirtualScrollTable.css";
const ROW_HEIGHT = 200;
const VISIBLE_ROWS = 20;

const VirtualScrollTable = () => {
  const containerRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);

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
        ref={containerRef}
        className="table-container"
        onScroll={handleScroll}
        style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}px`, overflowY: "auto" }}
      >
        <div style={{ height: `${flatData.length * ROW_HEIGHT}px` }}>
          {flatData.map((row, index) => (
            <div
              key={row.id}
              style={{
                position: "absolute",
                top: `${index * ROW_HEIGHT}px`,
                height: `${ROW_HEIGHT}px`,
                width: "100%",
                margin: "20px",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
              className="table-data"
            >
              <h2>Customer: {row.customerName}</h2>
              <h2 style={{ color: "gray" }}>Amount: {row.orderAmount}</h2>
              <h3 style={{ color: "gray" }}>Status: {row.status}</h3>
            </div>
          ))}
        </div>
      </div>

      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
};

export default VirtualScrollTable;
