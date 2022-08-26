import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

import { Grocery } from '../grocery';
import { GroceryService } from '../grocery.service';

@Component({
  selector: 'app-grocery-detail',
  templateUrl: './grocery-detail.component.html',
  styleUrls: ['./grocery-detail.component.css']
})
export class GroceryDetailComponent implements OnInit {

  @Input() grocery?: Grocery;

  aisles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private groceryService: GroceryService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getGrocery();
    this.aisles = this.groceryService.aisles;
  }

  getGrocery(): void {
    const uid = this.route.snapshot.paramMap.get('uid');

    this.groceryService.getGrocery(uid)
      .subscribe(grocery => this.grocery = grocery);
  }

  updateGrocery(): void {
    this.groceryService.PostGrocery(this.grocery!).subscribe(_ => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

}
