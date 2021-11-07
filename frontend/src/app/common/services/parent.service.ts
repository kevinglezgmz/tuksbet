import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  url: string = environment.serverUrl + '/api';

  constructor(private httpClient: HttpClient) {}

  get(endpoint: string): Promise<any> {
    const fullApiUrl = this.url + endpoint;
    return this.httpClient.get(fullApiUrl).toPromise();
  }

  update(endpoint: string, body: object, headers?: HttpHeaders | undefined): Promise<any> {
    const fullApiUrl = this.url + endpoint;
    return this.httpClient.patch(fullApiUrl, body, { headers }).toPromise();
  }

  delete(endpoint: string, headers?: HttpHeaders | undefined): Promise<any> {
    const fullApiUrl = this.url + endpoint;
    return this.httpClient.delete(fullApiUrl, { headers }).toPromise();
  }

  create(endpoint: string, body: object, headers?: HttpHeaders | undefined): Promise<any> {
    const fullApiUrl = this.url + endpoint;
    return this.httpClient.post(fullApiUrl, body, { headers }).toPromise();
  }
}
