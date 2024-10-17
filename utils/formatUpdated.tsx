import moment from "moment";

export const formatDateTimeString = (dateTimeString: string) =>
  moment(dateTimeString).fromNow();
