import styles from "./InlineImage.module.scss";
import Image, { StaticImageData } from "next/image";

type InlineImageProps = {
  src: string | StaticImageData;
};

export const InlineImage = ({ src }: InlineImageProps) => (
  <div className={styles.container}>
    <Image src={src} alt="card" />
  </div>
);
