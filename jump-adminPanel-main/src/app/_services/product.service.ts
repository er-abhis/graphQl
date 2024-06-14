import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { API_URL } from '../_interface/constants';
import {  valueType } from '../_interface/interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}
  private FetchProductAPI: string = `${API_URL}?`;
  private registerProductAPI: string = `${API_URL}auth/signup`;
  private ediProductApi: string = `${API_URL}products/update_product/`;
  private deletProductApi: string = `${API_URL}?`;
  private searchProductAPI: string = `${API_URL}products/search_product`;

  private getGomprehenciveListAPI: string = `${API_URL}comprensive/get_all_comprensive`;
  private addComprehenciveListAPI: string = `${API_URL}comprensive/add_comprensive`;
  private editComprehenciveListAPI: string = `${API_URL}comprensive/update_comprensive/`;
  deleteCompListAPI: any = `${API_URL}comprensive/delete_comprensive/`;

  private FetchRolesAPI: string = `${API_URL}roles/get_all_roles`;
  private addNewRoleAPI: string = `${API_URL}roles/add_role`;
  private editRoleAPI: string = `${API_URL}roles/update_role/`;

  private refreshHeader = new Subject<void>();
  refreshHeader$ = this.refreshHeader.asObservable();

  triggerRefresh() {
    this.refreshHeader.next();
  }

  // getProducts(
  //   page: number,
  //   pageSize: number,
  // ): Observable<{ data: any[]; pagination: any; id: any }> {



  // const query = 'query {products {_id,name,description,price,discount,created_at}}';

  // const variables = {
  //   limit: pageSize,
  //   page: page
  // };

  // // return this.http.post<any>(this.FetchProductAPI, {
  // //   query: query,
  // //   // variables: variables
  // // });
  //   return this.http.get<any>(this.FetchProductAPI, {
  //     params: new HttpParams()
  //       // .set('limit', pageSize.toString())
  //       // .set('page', page.toString()),
  //       .set('query', JSON.stringify(query)),
  //   });
  // }

  getProducts( page: number,  pageSize: number,queryxdsd:any): Observable<any> {

    // const querysss = 'query {products {name,description,price,discount,created_at}}';


    var querysss = "query {products{products{_id, description, price, discount,created_at,updated_at}}}";

    return this.http.post(this.FetchProductAPI , {
      query: querysss
    });
  }

  registerProduct(
data
  ) {
   console.log('data',data);
   
    var querysss = `mutation {
      createProduct(productInput: { name: "${data.description}",description: "${data.description}",price: ${data.price},discount: ${data.discount}}){
          _id,
          name,
          description,
          price,
          discount,
          created_at,
          updated_at
      }
     }`;

    return this.http.post(this.FetchProductAPI , {
      query: querysss
    });

  }

  updateProduct(
id,data
  ) {
  //  console.log('data',data);
  //  console.log('id',id);
   
    // var querysss = `mutation {
    //   createProduct(productInput: { name: "${data.description}",description: "${data.description}",price: ${data.price},discount: ${data.discount}}){
    //       _id,
    //       name,
    //       description,
    //       price,
    //       discount,
    //       created_at,
    //       updated_at
    //   }
    //  }`;

    var querysss = `mutation {
      updateProduct(id:"${id}",productInput: { name: "${data.description}",description: "${data.description}",price: ${data.price},discount: ${data.discount}}){
          _id,
          name,
          description,
          price,
          discount,
          created_at,
          updated_at
      }
      }`;



    return this.http.post(this.FetchProductAPI , {
      query: querysss
    });

  }
  deleteProduct(productId: number) {
    // console.log('productId',productId);
    
    var querysss = `mutation { deleteProduct(id:"${productId}"){  _id,     name,  description,price, discount,    created_at,  updated_at   } }`;

    return this.http.post(this.FetchProductAPI , {
      query: querysss
    });
  }

  searchProduct(
    search: string,
    page: number,
    pageSize: number,
  ): Observable<{ data: any[]; pagination: any; id: any; statusCode: number }> {
    return this.http.post<any>(this.searchProductAPI, {search}, {
      params: new HttpParams()
        .set('limit', pageSize.toString())
        .set('page', page.toString()),
    });
  }

  getComprehensiveList(
    page: number,
    pageSize: number,
  ): Observable<{ data: any[]; pagination: any; id: any }> {
    return this.http.get<any>(this.getGomprehenciveListAPI, {
      params: new HttpParams()
        .set('limit', pageSize.toString())
        .set('page', page.toString()),
    });
  }

  addComprehensiveList(name: string) {
    return this.http.post(this.addComprehenciveListAPI, { name });
  }

  editComprehensiveList(id: number, name: string) {
    return this.http.post(
      this.editComprehenciveListAPI + id + '?_method=PATCH',
      { name },
    );
  }
  deleteComprehensiveList(compId: valueType) {
    return this.http.delete<any>(this.deleteCompListAPI + compId);
  }
  
}
