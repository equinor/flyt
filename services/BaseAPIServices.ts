import { APIConfigs } from "../Config";
import axios from "axios";
import { getAccessToken } from "../auth/msalHelpers";

class BaseApiService {
  async get(path: string) {
    return axios.get(APIConfigs.url + path, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
  }

  async post(path: string, data: unknown) {
    return axios.post(APIConfigs.url + path, data, {});
  }

  async put(url: string, data: unknown) {
    return axios.put(APIConfigs.url + url, data, {});
  }

  async patch(path: string, data: unknown) {
    return axios.patch(APIConfigs.url + path, data, {});
  }

  async delete(path: string, data?: unknown) {
    return axios.delete(APIConfigs.url + path, {
      data: data ?? null,
    });
  }

  async uploadFile(path: string, formData: unknown) {
    return axios.post(APIConfigs.url + path, formData, {});
  }
}

export default new BaseApiService();
