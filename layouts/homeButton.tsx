import styles from "./default.layout.module.scss";
import Link from "next/link";
import { Button, Typography } from "@equinor/eds-core-react";
import Image from "next/image";
import React from "react";
import { TooltipImproved } from "../components/TooltipImproved";

export function HomeButton(): JSX.Element {
  return (
    <TooltipImproved title={"Go to the frontpage"}>
      <div className={styles.homeButton}>
        <Link href={"/"}>
          <Button variant={"ghost"}>
            <Image src={"/logo.png"} alt={"Logo"} width={12.53} height={25} />
            <span style={{ padding: 4 }} />
            <Typography className={styles.homeButtonText} variant={"h4"}>
              Flyt
            </Typography>
          </Button>
        </Link>
      </div>
    </TooltipImproved>
  );
}
