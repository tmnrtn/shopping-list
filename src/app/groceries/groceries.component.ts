import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {FormControl, ReactiveFormsModule } from '@angular/forms';

import { Grocery } from '../grocery';
import { GroceryService } from '../grocery.service';
import { ingredient } from '../ingredient';
import { SearchURL, URLS } from '../searchUrls';


@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.component.html',
  styleUrls: ['./groceries.component.css']
})
export class GroceriesComponent implements OnInit {

  groceries: Grocery[] = [];
  aisles: string[] = [];

  searchRes$!: Observable<ingredient[]>;
  private searchTerms = new Subject<string>();

  columnsToDisplay = ['ingredient', 'aisle', 'purchased', 'delete', 'view'];
  dataSource = new MatTableDataSource<Grocery>();

  @ViewChild(MatSort) sort!: MatSort;

  myControl = new FormControl('');

  selected = 'Not purchased'
  selectedSearchURL! : SearchURL;

  searchURLs = URLS;

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

  viewItem(grocery: Grocery): void {
    window.open(this.selectedSearchURL.url + grocery.ingredient, '_blank');

  }

  onGroceryChange(grocery: Grocery): void {
    this.groceryService.PostGrocery(grocery).subscribe();
    this.dataSource.data = this.groceries;

  }


  search(term: string): void {
    this.searchTerms.next(term);
  }

  displayFn(grocery: Grocery): string {
    return grocery && grocery.name ? grocery.name[0] : '';
  }

  filterTable():void {
    this.dataSource.filter = this.selected;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
      // This example uses English messages. If your application supports
      // multiple language, you would internationalize these strings.
      // Furthermore, you can customize the message to add additional
      // details about the values being sorted.
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }

  constructor(private groceryService: GroceryService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.getGroceries();
    this.aisles = this.groceryService.aisles;

    this.dataSource.filterPredicate = (data: Grocery, filter: string) => {
      return data.purchased == (filter == "Purchased") || filter == "All";
     };

     this.filterTable();

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
