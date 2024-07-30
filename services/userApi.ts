import { AxiosPromise } from "axios";
import BaseAPIServices from "./BaseAPIServices";
import { UserAccessSearch } from "../types/UserAccessSearch";

const baseUrl = "/api/v2.0";

/**
 * Give a new user access to a vsm
 * @param newUser
 */
export const add = (newUser: {
  user: string;
  vsmId: number;
  role: string;
  fullName: string;
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
  accessId: number;
  vsmId: number;
}): AxiosPromise =>
  BaseAPIServices.delete(
    `${baseUrl}/userAccess/${props.vsmId}/${props.accessId}`
  );

/**
 * Retrieve registered users or search for a short or full name.
 * @param userName - The short or full name of the user to search for.
 * @returns - Array of users.
 */
export const searchUser = (userName: string): Promise<UserAccessSearch[]> =>
  BaseAPIServices.get(`${baseUrl}/users/query?startsWith=${userName}`).then(
    (res) => res.data
  );

export const getUserByShortname = (
  shortName: string
): Promise<{ pkUser: number; userName: string }[]> =>
  BaseAPIServices.get(`${baseUrl}/userAccess/userSearch?q=${shortName}`).then(
    (res) => res.data
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
