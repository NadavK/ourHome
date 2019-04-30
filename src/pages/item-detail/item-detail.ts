import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IOs } from '../../providers/providers';
import {IO, Output} from "../../models/io";

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;

  constructor(public navCtrl: NavController, navParams: NavParams, public items: IOs) {
    this.item = navParams.get('item') || items.defaultItem;
  }

  back() {
    this.navCtrl.pop();
  }

  mouseclickOn(item: IO) {
    console.log('Clicked On:', item);
    this.items.set_state(item, true);
  }

  mouseclickOff(item: IO) {
    console.log('Clicked Off:', item);
    this.items.set_state(item, false);
  }

  get OutputModel(): string {
    return Output.model;
  }
}
