import { category } from "@equinor/eds-icons";
import { useRouter } from "next/router";
import { ButtonWrapper } from "./ButtonWrapper";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/process/{id}"
 * @constructor
 */
export const CategorizationPageButton = (): JSX.Element => {
  const router = useRouter();

  return (
    <ButtonWrapper
      icon={category}
      title={"Categorize PQIR's"}
      onClick={() => router.push(`${router.asPath}/categories`)}
    />
  );
};
