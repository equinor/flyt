import { WashOutFilter } from "./WashOutFilter/WashOutFilter";
import { LoadingVSMCard } from "./Card/LoadingVSMCard";
import React from "react";
import { NewProjectButton } from "./NewProjectButton";
import Masonry from "react-masonry-css";
import styles from "../pages/processes/Projects.module.scss";

export function PlaceholderProjectCards(props: {
  numberOfCards: number;
  showNewProjectButton: boolean;
}): JSX.Element {
  const { numberOfCards, showNewProjectButton } = props;

  const breakpointColumnsObj = {
    default: 4,
    1648: 3,
    1300: 2,
    952: 1,
  };

  const arrayPlaceholderCards = showNewProjectButton
    ? [<NewProjectButton key="new" />].concat(
        Array.from(Array(numberOfCards || 19).keys()).map((e) => (
          <WashOutFilter key={e}>
            <LoadingVSMCard />
          </WashOutFilter>
        ))
      )
    : Array.from(Array(numberOfCards || 19).keys()).map((e) => (
        <WashOutFilter key={e}>
          <LoadingVSMCard />
        </WashOutFilter>
      ));

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.grid}
        columnClassName={styles.gridcolumn}
      >
        {arrayPlaceholderCards}
      </Masonry>
    </>
  );
}
