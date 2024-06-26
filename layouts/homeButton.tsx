import styles from "./default.layout.module.scss";
import Link from "next/link";
import { Button, Typography } from "@equinor/eds-core-react";
import Image from "next/image";
import greenLogo from "../public/greenLogo.png";

export function HomeButton(): JSX.Element {
  return (
    <div className={styles.homeButton}>
      <Link href={"/"}>
        <Button variant={"ghost"}>
          <Image
            src={greenLogo}
            alt={"Logo"}
            width={0}
            height={0}
            className={styles.image}
          />
          <span style={{ padding: 4 }} />
          <Typography className={styles.homeButtonText} variant={"h4"}>
            Flyt
          </Typography>
        </Button>
      </Link>
    </div>
  );
}
