import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  url: string = environment.serverUrl.concat('/api');

  constructor(private httpClient: HttpClient) {}

  protected get(endpoint: string): Promise<any> {
    const fullApiUrl = this.url.concat(endpoint);
    return this.httpClient.get(fullApiUrl).toPromise();
  }

  protected update(endpoint: string, body: object, headers?: HttpHeaders | undefined): Promise<any> {
    const fullApiUrl = this.url.concat(endpoint);
    return this.httpClient.patch(fullApiUrl, body, { headers }).toPromise();
  }

  protected delete(endpoint: string, headers?: HttpHeaders | undefined): Promise<any> {
    const fullApiUrl = this.url.concat(endpoint);
    return this.httpClient.delete(fullApiUrl, { headers }).toPromise();
  }

  protected create(endpoint: string, body: object, headers?: HttpHeaders | undefined): Promise<any> {
    const fullApiUrl = this.url.concat(endpoint);
    return this.httpClient.post(fullApiUrl, body, { headers }).toPromise();
  }
}
