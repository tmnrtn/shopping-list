import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { gzip } from 'pako';



import { Grocery } from './grocery';
import { GroceryResponse } from './grocery.response';
import { ingredient } from './ingredient';
import INGREDIENTS from './Ingredients.json'

@Injectable({
  providedIn: 'root'
})
export class GroceryService {


  apiURL = 'http://localhost:4200/api/v2/sync/';
  bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDI1MTYxNDQsImVtYWlsIjoidG1ucnRuQGdtYWlsLmNvbSJ9.zwNe471dQeZJh5MuB9IvWb8i6CspEQviowgCU038aTE';

  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.bearerToken}`
    })
  };

  ingredientJSON = INGREDIENTS;

  ingredients : ingredient[] = [];



  getGroceries(): Observable<Grocery[]> {
    return this.http
      .get<GroceryResponse>(this.apiURL + 'groceries/', this.httpOptions)
      .pipe(map(response => response.result))
  }

  getGrocery(uid: string | null): Observable<Grocery> {
    return this.http
      .get<GroceryResponse>(this.apiURL + 'groceries/', this.httpOptions)
      .pipe(map(response => response.result.find(g => { return g.uid === uid }) as Grocery))
  }

  PostGrocery(grocery: Grocery): Observable<any> {

    let groceryArr : Grocery[] = []
    groceryArr.push(grocery);

    const compressed = gzip(JSON.stringify(groceryArr));
    const blob = new Blob([compressed.buffer]);

    const formData = new FormData();
    formData.append('data', blob)

    return this.http.post<any>(this.apiURL + 'groceries/', formData, this.httpOptions).pipe(
      tap((v) => console.info(v)));

  }


  FormGrocery(name: string): Grocery {
    let myuuid = uuidv4();

    let searchRes  = this.SearchIngredients(name, true);
    let  aisle = '';
    if (searchRes.length > 0) {
      aisle = searchRes[0].aisle;
    }    
    else{
      aisle = 'Miscellaneous';
    }



    const grocery: Grocery = {
      uid: myuuid,
      recipe_uid: null,
      name: name,
      order_flag: 1,
      purchased: false,
      aisle: aisle,
      ingredient: name,
      recipe: null,
      instruction: '',
      quantity: '',
      separate: false,
      aisle_uid: '',
      list_uid: "9E12FCF54A89FC52EA8E1C5DA1BDA62A6617ED8BDC2AEB6F291B93C7A399F6F6",
      deleted: false
    };


    return grocery;
  }

  GetIngredients(): void {
    let a: keyof typeof this.ingredientJSON;

    for (a in this.ingredientJSON) {
      let aisleContents = this.ingredientJSON[a];
      for (const [k, v] of Object.entries(aisleContents)) {
        let ing = new ingredient(a, v);
        this.ingredients.push(ing);
      }
    }
  }

  SearchIngredientsAsync(searchStr:string, exactSearch:boolean = false) : Observable<ingredient[]> {
    return of(this.SearchIngredients(searchStr, exactSearch));
  }

  SearchIngredients(searchStr:string, exactSearch:boolean = false) : ingredient[] {
    searchStr = searchStr.toLowerCase();
    let res : ingredient[] = [];
    if(searchStr.length > 2) {
    let exact = this.ingredients.filter(i=> i.name.find(n => n.toLowerCase() == searchStr) !== undefined);
    let exactVar = this.ingredients.filter(i=>i.variations.length > 0 && i.variations.find(n => typeof n == 'string' && n.toLowerCase() == searchStr) !== undefined);
    
    res = res.concat(exact);
    res = res.concat(exactVar.filter(x => !res.includes(x)));

    if(!exactSearch) {
      let startsWith = this.ingredients.filter(i=> i.name.find(n => n.toLowerCase().startsWith(searchStr)) !== undefined);
      let startsWithVar = this.ingredients.filter(i=> i.variations.find(n => typeof n == 'string' &&  n.toLowerCase().startsWith(searchStr)) !== undefined);
      let contains = this.ingredients.filter(i=> i.name.find(n => n.toLowerCase().includes(searchStr)) !== undefined);
      let containsVar = this.ingredients.filter(i=> i.variations.find(n => typeof n == 'string' &&  n.toLowerCase().includes(searchStr)) !== undefined);

      res = res.concat(startsWith.filter(x => !res.includes(x)))
      res = res.concat(startsWithVar.filter(x => !res.includes(x)))
      res = res.concat(contains.filter(x => !res.includes(x)))
      res = res.concat(containsVar.filter(x => !res.includes(x)))
    }
  }

    return res;
  }

  constructor(private http: HttpClient) {
    this.GetIngredients();
   }

}
