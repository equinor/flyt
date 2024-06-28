import { AxiosPromise } from "axios";
import BaseAPIServices from "./BaseAPIServices";
import { UserAccessSearch } from "@/types/UserAccess";

const baseUrl = "/api/v2.0";

/**
 * Give a new user access to a vsm
 * @param newUser
 */
export const add = (newUser: {
  user: UserAccessSearch["shortName"];
  vsmId: number;
  role: string;
  fullName: UserAccessSearch["displayName"];
}): AxiosPromise =>
  BaseAPIServices.post(`${baseUrl}/userAccess`, newUser).then(
    (value) => value.data
  );

/**
 * Update access for a user
 * @param props
 */
export const update = (props: {
  user: { accessId: number };
  role: string;
}): AxiosPromise =>
  BaseAPIServices.patch(`${baseUrl}/userAccess`, {
    accessId: props.user.accessId,
    role: props.role,
  });

/**
 * Remove access from a user.
 * @param props
 */
export const remove = (props: {
  accessId: string;
  vsmId: number;
}): AxiosPromise =>
  BaseAPIServices.delete(
    `${baseUrl}/userAccess/${props.vsmId}/${props.accessId}`
  );

/**
 * Gets the access for the specified user in the specified Vsm
 * @param props
 */
export const get = ({ vsmId, userName }) => {
  return BaseAPIServices.get(`${baseUrl}/userAccess/${vsmId}/${userName}`).then(
    (res) => res.data
  );
};

/**
 * Retrieve registered users or search for a short-name.
 * @param userName - The short-name of the user to search for.
 * @returns - Array of users.
 */
export const searchUser = (userName: string): Promise<UserAccessSearch[]> =>
  BaseAPIServices.get(`${baseUrl}/users/query?startsWith=${userName}`).then(
    (value) => value.data
  );

export const getUserByShortname = (
  userName: string
): Promise<{ pkUser: number; userName: string }[]> =>
  BaseAPIServices.get(`${baseUrl}/userAccess/userSearch?q=${userName}`).then(
    (value) => value.data
  );

export const getUserById = (
  userId: number | string
): Promise<{
  pkUser: number;
  userName: string;
}> =>
  BaseAPIServices.get(`${baseUrl}/userAccess/userById/${userId}`).then(
    (res) => res.data
  );
