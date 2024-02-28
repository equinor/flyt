import { Typography } from "@equinor/eds-core-react";
import Image, { StaticImageData } from "next/image";
import { CSSProperties, ReactNode, RefObject } from "react";
import styles from "./CanvasTutorialSection.module.scss";

type CanvasTutorialSectionProps = {
  containerRef: RefObject<HTMLDivElement>;
  title: string;
  children: ReactNode;
  image: string | StaticImageData;
  style?: CSSProperties;
};

export const CanvasTutorialSection = ({
  containerRef,
  title,
  children,
  image,
  style,
}: CanvasTutorialSectionProps) => (
  <div ref={containerRef} style={style}>
    <div className={styles.titleAndDescription}>
      <Typography className={styles.title} variant="h3">
        {title}
      </Typography>
      <Typography variant="body_long">{children}</Typography>
    </div>
    <Image className={styles.image} src={image} layout="responsive" alt="gif" />
  </div>
);
