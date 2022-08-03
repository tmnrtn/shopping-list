import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import {FormControl, ReactiveFormsModule } from '@angular/forms';

import { Grocery } from '../grocery';
import { GroceryService } from '../grocery.service';
import { ingredient } from '../ingredient';


@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.css']
})
export class GroceriesComponent implements OnInit {

  groceries: Grocery[] = [];

  searchRes$!: Observable<ingredient[]>;
  private searchTerms = new Subject<string>();

  columnsToDisplay = ['name', 'aisle', 'purchased', 'delete'];
  dataSource = new MatTableDataSource<Grocery>();

  myControl = new FormControl('');



  getGroceries(): void {
    this.groceryService.getGroceries()
      .subscribe(groceries => {
        this.groceries = groceries; 
        this.dataSource.data = this.groceries;
      });

  }

  addItem(name: string): void {
    const newGrocery = this.groceryService.FormGrocery(name);

    this.groceryService.PostGrocery(newGrocery).subscribe();
    //.subscribe(_ => this.getGroceries());
    this.groceries.push(newGrocery);
    this.dataSource.data = this.groceries;
    this.searchTerms.next('');
  }

  deleteItem(grocery: Grocery): void {
    grocery.deleted = true;

    this.groceryService.PostGrocery(grocery).subscribe();
    //.subscribe(_ => this.getGroceries());
    this.groceries = this.groceries.filter(g => g !== grocery);
    this.dataSource.data = this.groceries;

  }


  search(term: string): void {
    this.searchTerms.next(term);
  }

  displayFn(grocery: Grocery): string {
    return grocery && grocery.name ? grocery.name[0] : '';
  }

  constructor(private groceryService: GroceryService) { }

  ngOnInit(): void {
    this.getGroceries();

    this.searchRes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.groceryService.SearchIngredientsAsync(term)),
    );
  }

}
