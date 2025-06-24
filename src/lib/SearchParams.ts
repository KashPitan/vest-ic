import { ReadonlyURLSearchParams } from "next/navigation";

export class SearchParams {
  private urlSearchParams: URLSearchParams;

  constructor(searchParams: string | ReadonlyURLSearchParams) {
    this.urlSearchParams = new URLSearchParams(searchParams);
  }

  getQueryValue = (queryParamName: string) => {
    const queryParamValue = this.urlSearchParams.get(queryParamName);
    if (queryParamValue) return queryParamValue.split(",");
  };

  setQueryValue = (
    queryParamName: string,
    queryValues: (string | number)[],
  ) => {
    const paramValue = queryValues.join(",");
    this.urlSearchParams.set(queryParamName, paramValue);
  };

  removeParam = (queryParamName: string) => {
    this.urlSearchParams.delete(queryParamName);
  };

  getSearchParams = () => this.urlSearchParams.toString();
}
