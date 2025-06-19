import { IFiltersContext } from "../../context/filters";
import { filtersToQueryParams } from "../../services/filtersToQueryParams";
import { TSendFunction } from "../apiService";
import { AxiosInstance } from "axios";

export const OPEN_WOO_LIMIT = 6;

export default class OpenWoo {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(_instance: AxiosInstance, send: TSendFunction) {
    this._instance = _instance;
    this._send = send;
  }

  public getAll = async (filters: IFiltersContext, currentPage: number, limit: number): Promise<any> => {
    let endpoint = `/publications?extend[]=catalog&extend[]=@self.schema&extend[]=@self.organization&${filtersToQueryParams(
      filters,
    )}&_order[publicatiedatum]=desc&_limit=${limit}&_page=${currentPage}`;

    // TODO: Uncomment this when filtering on oin is available in the API
    // if (window.sessionStorage.getItem("OIDN_NUMBER")) {
    //   endpoint += `&organization.oin=${window.sessionStorage.getItem("OIDN_NUMBER")}`;
    // }

    const { data } = await this._send(this._instance, "GET", endpoint);

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(
      this._instance,
      "GET",
      `/publications/${id}?extend[]=themes&extend[]=@self.schema`,
    );

    return data;
  };

  public getAttachments = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/publications/${id}/attachments?_limit=500`);

    return data;
  };
}
