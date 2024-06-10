import { AxiosPromise } from "axios";
import BaseAPIServices from "./BaseAPIServices";

const baseUrl = "/api/v2.0";

/**
 * Give a new user access to a vsm
 * @param newUser
 */
export const add = (newUser: {
  user: string;
  vsmId: number;
  role: string;
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
 * Retrieve registered users or search for a short-name.
 * @param userName - The short-name of the user to search for.
 * @returns - Array of users.
 */
export const searchUser = (userName: string): Promise<User[]> =>
  BaseAPIServices.get(`${baseUrl}/userAccess/userSearch?q=${userName}`).then(
    (value) => value.data as User[]
  );

export const getUserById = (userId: number | string): Promise<User> =>
  BaseAPIServices.get(`${baseUrl}/userAccess/userById/${userId}`).then(
    (res) => res.data as User
  );
