import { useUserAccount } from "./useUserAccount";
import { CardAccess } from "@/types/CardAccess";
import { getUserShortName } from "@/utils/getUserShortName";

export const useUSerEditNode = (
  id: string,
  userEditCardStatus: CardAccess[] | undefined
) => {
  const account = useUserAccount();
  const shortName = account ? getUserShortName(account) : "";
  const selectedCardDetails = (userEditCardStatus || []).filter(
    (card) => card.cardId === id
  );
  const selectedCard = selectedCardDetails.length
    ? selectedCardDetails[0]
    : null;
  const isCardHasNoAccess = selectedCardDetails.length ? false : true;
  const isCardEditablebyUser = isCardHasNoAccess
    ? true
    : selectedCardDetails.some((card) => card.userId === shortName);
  return {
    isCardEditablebyUser,
    shortName,
    isCardHasNoAccess,
    selectedCard,
  };
};
