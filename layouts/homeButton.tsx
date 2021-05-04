import styles from "./default.layout.module.scss";
import Link from "next/link";
import { Button, Typography } from "@equinor/eds-core-react";
import Image from "next/image";
import React from "react";

export function HomeButton(): JSX.Element {
  return (
    <div className={styles.homeButton}>
      <Link href={"/"}>
        <Button variant={"ghost"}>
          <Image src={"/logo.png"} alt={"Logo"} width={8} height={16} />
          <span style={{ padding: 2 }} />
          <Typography className={styles.homeButtonText} variant={"h4"}>
            Flyt
          </Typography>
        </Button>
      </Link>
    </div>
  );
}