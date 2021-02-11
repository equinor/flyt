import axios, { AxiosResponse } from "axios";
import { getAccessToken } from "../auth/msalHelpers";
import { APIConfigs } from "../Config";

class BaseApiService {

  async get(path: string): Promise<AxiosResponse<any>> {
    return axios.get(APIConfigs.url + path, {
      headers: {
        Authorization: await getAccessToken()
      }
    });
  }

  async post(path: string, data: object): Promise<AxiosResponse<any>> {
    return axios.post(APIConfigs.url + path, data, {
      headers: {
        ContentType: "application/json",
        Authorization: await getAccessToken()
      }
    });
  }

  async put(url: string, data: object): Promise<AxiosResponse<any>> {
    return axios.put(APIConfigs.url + url, data, {
      headers: {
        Authorization: await getAccessToken()
      }
    });
  }

  async patch(path: string, data: object): Promise<AxiosResponse<any>> {
    return axios.patch(APIConfigs.url + path, data, {
      headers: {
        Authorization: await getAccessToken()
      }
    });
  }

  async delete(path: string, data?: object): Promise<AxiosResponse<any>> {
    return axios.delete(APIConfigs.url + path, {
      headers: {
        Authorization: await getAccessToken()
      },
      data: data ?? null
    });
  }

  async uploadFile(path: string, formData: any): Promise<AxiosResponse<any>> {
    return axios.post(APIConfigs.url + path, formData, {
      headers: {
        Authorization: await getAccessToken(),
        "content-type": "multipart/form-data"
      }
    });
  }

}

export default new BaseApiService();
