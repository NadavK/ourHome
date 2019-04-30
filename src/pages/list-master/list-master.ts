import { Component } from '@angular/core';
import {NavController, ModalController, ToastController, Toast} from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { IOs } from '../../providers/ios';
import { Item } from '../../models/item';
import { Tag, IO } from "../../models/io";
import {OnetimeScheduleDetailPage} from "../onetimeschedule-detail/onetimeschedule-detail";

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  data: Tag[];
  loading: Toast;
  private showingGroup: number;

  constructor(public navCtrl: NavController, private loadingCtrl: ToastController, public items: IOs, public modalCtrl: ModalController) {
    //console.log('ListMasterPage')

    //TODO: Why is this in the ctor?
    //this.data = this.items.all;   // subscribe to entire collection
    this.loadData();
    this.showingGroup = null;
  }

  loadData() {
    this.showLoading('Loading...');
    //this.items.all
    //  .subscribe((all: Tag[]) => {
    //    this.data = all;
    //  });

    this.items.loadAll().subscribe(all => {            // load all items
      this.data = all;
      this.hideLoading();
    }, error => this.loading.dismiss());
  }

  ngOnInit(): void {
  }

  showLoading(text) {
    this.loading = this.loadingCtrl.create({
      message: text,
      position: 'bottom'
    });
    this.loading.present();
   }

  hideLoading() {
    if (this.loading)
    {
      this.loading.dismiss().then(this.loading = null);
    }
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.toggleGroup(0);
  }


  nothing(item, e) {
    e.stopPropagation();
    e.preventDefault();
  }

  openSchedule(item, e) {
    console.log('openSchedule', e);
    e.stopPropagation();
    this.navCtrl.push(OnetimeScheduleDetailPage, {
      item: item
    });
  }


  onClick($event,h,m) {
    console.log('onClick:', h, m);
  }


  onEvent($event,h,m) {
    console.log('*** Event: h=' + h + ', m=' + m + ', ' + $event.type);
    //console.log('*** Event obj: ', $event);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    console.log('Clicked:', item);
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

  mouseclickState(item: IO) {
    console.log('Clicked state:', item);
    this.items.set_state(item, !item.state);
  }

  //logout(){
  //  this.auth.logout();
  //  this.navCtrl.setRoot(LoginPage);
  //}

  toggleGroup(group) {
    if (this.isGroupShowing(group)) {
        this.showingGroup = null;
    } else {
        this.showingGroup = group;
    }
  };
  isGroupShowing(group) {
      return this.showingGroup === group;
  };
}
