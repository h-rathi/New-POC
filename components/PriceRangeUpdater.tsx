"use client";

import { useEffect } from "react";
import { usePriceRangeStore } from "@/app/_zustand/priceRangeStore";

export const PriceRangeUpdater = ({
  minPrice,
  maxPrice,
}: {
  minPrice: number;
  maxPrice: number;
}) => {
  const setPriceRange = usePriceRangeStore((state) => state.setPriceRange);

  useEffect(() => {
    setPriceRange(minPrice, maxPrice);
  }, [minPrice, maxPrice, setPriceRange]);

  return null;
};
