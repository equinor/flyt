import { WashOutFilter } from "./WashOutFilter/WashOutFilter";
import { LoadingVSMCard } from "./Card/LoadingVSMCard";
import React from "react";

export function PlaceholderProjectCardsArray(
  numberOfCards: number
): JSX.Element[] {
  return Array.from(Array(numberOfCards || 19).keys()).map((e) => (
    <WashOutFilter key={e}>
      <LoadingVSMCard />
    </WashOutFilter>
  ));
}
