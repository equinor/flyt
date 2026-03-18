import { useUserAccount } from "./useUserAccount";
import { CardAccess } from "@/types/CardAccess";
import { getUserShortName } from "@/utils/getUserShortName";

export const useUSerEditNode = (
  id: string,
  userEditCardStatus: CardAccess[] | undefined
) => {
  const account = useUserAccount();
  const shortName = account ? getUserShortName(account) : "";
  const selectedCard = (userEditCardStatus || []).filter(
    (card) => card.cardId === id
  );
  const isCardHasNoAccess = selectedCard.length ? false : true;
  const isCardEditablebyUser = isCardHasNoAccess
    ? true
    : selectedCard.some((card) => card.userId === shortName);
  return {
    isCardEditablebyUser,
    shortName,
    isCardHasNoAccess,
    selectedCard,
  };
};
