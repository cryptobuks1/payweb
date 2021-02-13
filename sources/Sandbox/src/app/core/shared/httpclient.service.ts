/**
* http client service
* This is the generic sevice of http methods.
* @package HttpclientService
* @subpackage app\core\shared\httpclientservice
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpclientService {

  constructor(private http: HttpClient) {
    
  }

  // For Read Operation
  public get<T>(url: string, params?: any): Observable<T> {
    return this.http.get<T>(url, { params: params });
  }

  // For Create Operation
  public post<T>(url: string, model: T): Observable<any> {
    return this.http.post<T>(url, JSON.stringify(model));
  }

  // For Update Operation
  public update<T>(url: string, model: T): Observable<T> {
    return this.http.put<T>(url, JSON.stringify(model));
  }
   // For Update Operation
   public put<T>(url: string, model: T): Observable<T> {
    return this.http.put<T>(url, JSON.stringify(model));
  }
  // For Update Operation
  public patch<T>(url: string, model: T): Observable<T> {
    return this.http.patch<T>(url, JSON.stringify(model));
  }

  // For Delete Operation by ID
  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }

  // For Delete Operation by Object
  public deleteByObj<T>(url: string, model: T): Observable<T> {
    return this.http.post<T>(url, JSON.stringify(model));
  }

  // Using this function we are binding/updating any url
  public urlBinding(url: string, queryParamList: any[]): string {
    const urlSplitList = (url.split('{'));
    let urlResult = urlSplitList[0].toString();
    urlSplitList.shift();
    for (let e in urlSplitList) {
      urlResult += urlSplitList[e].replace(urlSplitList[e].split('}')[0], queryParamList[e]).replace('}', '');
    }
    return urlResult;
  }
}
