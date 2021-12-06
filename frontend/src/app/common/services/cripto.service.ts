import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class CriptoService {
  url: string = environment.serverUrl + '/api/cripto/prices';

  constructor(private httpService: HttpClient) {}

  getCoinPrices(coins: string | undefined): Promise<any> {
    return this.httpService.get(this.url + '?coins=' + coins || '').toPromise();
  }
}
