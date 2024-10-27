import axios from "axios";

class BaseService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public fetchAll = (): Promise<T[]> => {
    return axios
      .get<T[]>(`${this.endpoint}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public fetchById = (id: number): Promise<T> => {
    return axios
      .get<T>(`${this.endpoint}/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public create = (command: any): Promise<T> => {
    return axios
      .post<T>(this.endpoint, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public update = (id: number, command: any): Promise<T> => {
    return axios
      .put<T>(`${this.endpoint}/${id}`, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public delete = (id: number): Promise<void> => {
    return axios
      .delete<void>(`${this.endpoint}/${id}`)
      .then(() => {})
      .catch((error) => {
        this.handleError(error);
      });
  };

  protected handleError(error: any) {
    console.error(`${this.endpoint} API Error:`, error);
    return Promise.reject(error);
  }
}

export default BaseService;
