import { Component, ViewChild } from '@angular/core';
import {Content, Loading, LoadingController, ModalController, ToastController} from 'ionic-angular';
import { NavController, AlertController, NavParams, Platform } from 'ionic-angular';

import { OnetimeSchedules } from "../../providers/onetime-schedules";
import { OnetimeSchedule } from "../../models/onetime-schedule";
import { Output } from "../../models/io";

@Component({
  selector: 'onetimeschedule-detail',
  templateUrl: 'onetimeschedule-detail.html'
})
export class OnetimeScheduleDetailPage {
  items: OnetimeSchedule[];
  datePickerValue: string = null;
  index: number = null;
  pre_drag_segments: string;      // This is how the segment looked before the drag started
  output: Output;
  private downPos: number;
  private dragging: boolean = false;    // True when user is dragging buttons
  private scrollTime: number = 0;       // The time that scrolling started; we do not scroll again until this type elapsed
  @ViewChild(Content) content: Content;
  loading: Loading;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private alertCtrl: AlertController, navParams: NavParams, public onetimeSchedules: OnetimeSchedules, private platform: Platform, private loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    this.output = navParams.get('item');
    this.loadData();
  }

  loadData() {
    this.showLoading('Loading...');

    this.onetimeSchedules.query({output: this.output.pk})
      .subscribe((data: OnetimeSchedule[]) => {
          this.loading.dismiss();
          this.items = [];
          data.forEach((t) => {
            let item = new OnetimeSchedule(t);
            this.items.push(item);
          });
          if (this.items.length) {
            this.setIndex(0);       // sets datePickerValue;
          }
        },
        error => {
          console.log('Loading error: ' + error);
          this.loading.dismiss();
          // Unable to log in
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.back();
        }
  );
        //console.log('ONETIME SCHEDULE DATA:', this.items)
  }

  back() {
    this.navCtrl.pop();
  }

  public save() {
    //this.showLoading()
    let i = 0;
    this.showLoading('Saving...');

    for (let item of this.items) {
      this.onetimeSchedules.save_or_add(item).subscribe(
        allowed => {
          if (allowed) {
            setTimeout(() => {
              //Splashscreen.hide();
              //this.loading.dismiss();
              i+=1;
              if (i == this.items.length) {
                this.loading.dismiss();
                this.back();
              }
            });
          } else {
            this.showError("Bad username/password");
          }
        },
        error => {
          this.showError(error);
          i+=1;
          if (i == this.items.length) {
            this.loading.dismiss();
            this.back();
          }

        });
    }

  }

  showLoading(text) {
   this.loading = this.loadingCtrl.create({
    content: text
   });
   this.loading.present();
   }

  showError(text?: string) {
    //setTimeout(() => {
    //  this.loading.dismiss();
    //});

    if (!text)
      return;

    let alert = this.alertCtrl.create({
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }


  replace(s, index, new_value) {
    return s.substr(0, index) + new_value + s.substr(index + 1);
  }

  toggleSegment(item, index) {
    item.segments = this.replace(item.segments, index, item.segments[index] == "1" ? "0" : "1");
  }

  // Toggle the button
  onTap($event, item, h, m) {
    console.log('onTap: h=' + h + ', m=' + m);
    let thisPos: number = h * 4 + m;
    this.toggleSegment(item, thisPos);
  }

  // start drag
  onPress($event, item, h, m) {
    console.log('onPress: h=' + h + ', m=' + m);
    this.dragging = true;
    this.downPos = h*4+m;
    this.toggleSegment(item, this.downPos);
    this.pre_drag_segments = item.segments;
  }

  onMouseUp($event, item, h, m) {
    console.log('onMouseUp: h=' + h + ', m=' + m);
    if (this.dragging) {
      this.dragging = false;
    }
  }

  onMouseMove($event, item, h, m) {
    console.log('*** onMouseMove: h=' + h + ', m=' + m, $event);
    console.log('content: ' + this.content.getContentDimensions().scrollTop);
    if (this.dragging) {
      //console.log('*** onTouchMove: ', $event);
      let thisPos: number = h*4+m;
      item.segments = this.pre_drag_segments;
      console.log("Marking IDs: " + this.downPos + '-->' + thisPos);
      for (let i: number = Math.min(thisPos, this.downPos); i <= Math.max(thisPos, this.downPos); i++) {
        if (i != this.downPos)
          item.segments = this.replace(item.segments, i, item.segments[this.downPos]);
      }
      /*if (y < (1.3 * this.content.contentTop) && (this.scrollTime < Date.now())) {
        console.log('Scrolling');
        this.scrollTime = Date.now()+200;
        this.content.scrollTo(x, this.content.getContentDimensions().scrollTop-60, 200);      // Consider using the promise instead of scrollTime
      }
      else if (y > (0.9 * this.platform.height()) && this.scrollTime < Date.now()) {
        console.log('Scrolling');
        this.scrollTime = Date.now()+200;
        this.content.scrollTo(x, this.content.getContentDimensions().scrollTop+60, 200);
      }*/
      //$event.stopPropagation();
      if ($event.preventDefault) {
        $event.preventDefault();
      }
    }
  }

  onTouchMove($event, item, h, m) {
    console.log('*** onTouchMove: h=' + h + ', m=' + m);
    console.log('content: ' + this.content.getContentDimensions().scrollTop);
    //console.log('content: ', this.content, getScrollTop());
    if (this.dragging) {
      //console.log('*** onTouchMove: ', $event);
      let x = Math.floor($event.clientX || $event.touches[0].clientX);
      let y = Math.floor($event.clientY || $event.touches[0].clientY);
      console.log('onTouchMove xy: ' + x + ',' + y + ' (' + this.content.contentTop + ')');
      var elem = <HTMLLIElement>document.elementFromPoint(x, y);
      //console.log('onTouchMove Element:', elem, elem.parentElement, elem.parentNode);
      if (elem && elem.parentElement && elem.parentElement.id) {
        let thisPos: number = Number(elem.parentElement.id);
        item.segments = this.pre_drag_segments;
        console.log("Marking IDs: " + this.downPos + '-->' + thisPos);
        for (let i: number = Math.min(thisPos, this.downPos); i <= Math.max(thisPos, this.downPos); i++) {
          if (i != this.downPos)
            item.segments = this.replace(item.segments, i, item.segments[this.downPos]);
        }
      }
      if (y < (1.3 * this.content.contentTop) && (this.scrollTime < Date.now())) {
        console.log('Scrolling');
        this.scrollTime = Date.now()+200;
        this.content.scrollTo(x, this.content.getContentDimensions().scrollTop-60, 200);      // Consider using the promise instead of scrollTime
      }
      else if (y > (0.9 * this.platform.height()) && this.scrollTime < Date.now()) {
        console.log('Scrolling');
        this.scrollTime = Date.now()+200;
        this.content.scrollTo(x, this.content.getContentDimensions().scrollTop+60, 200);
      }
      //$event.stopPropagation();
      if ($event.preventDefault) {
        $event.preventDefault();
      }
    }
  }

  onEvent($event, item, h, m) {
    console.log("onEvent", h, m, $event);
  }

  prevItem() {
    if (this.index > 0) {
      this.setIndex(this.index - 1);
    }
  }

  nextItem() {
    if (this.index < this.items.length-1) {
      this.setIndex(this.index + 1);
    }
  }

  public allOn() {
    this.items[this.index].setAllOn();
  }
  public allOff() {
    this.items[this.index].setAllOff();
  }

  localISODate(date: Date) {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {

    //{"start":"2017-05-01T08:01:00Z","end":"2017-05-01T19:22:00Z","segments":"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","active":true,"deleted":false,"description":"","updated":"2017-07-17T22:16:14.500469Z","task_id":"","output":44},
    let item = new OnetimeSchedule({output: this.output.pk, active: true, deleted: false});
    item.setAllOff();
    let date:Date = new Date();
    item.dateISO = this.localISODate(date).slice(0,10);

    //find the next date without a schedule
    while (this.findIndexByISODate(item.dateISO) != -1) {
      date.setDate(date.getDate() + 1);
      console.log(date);
      item.dateISO = this.localISODate(date).slice(0,10);
    }

    item.start = "00:00";
    item.end = "23:59";
    this.items.push(item);
    this.SortAndReselect(this.items.length-1);
    /*
    let addModal = this.modalCtrl.create(OneTimeScheduleCreatePage);
    addModal.onDidDismiss(item => {
      if (item) {
        item.start = item.date + 'T' + item.start;
        item.end = item.date + 'T' + item.end;
        item.output = this.output.pk;
        let onetimeSchedule: OnetimeSchedule = new OnetimeSchedule(item);
        console.log('onetimeSchedule', onetimeSchedule);
        this.onetimeSchedules.add(onetimeSchedule)
          .subscribe((data:any) => {
          console.log(data);

          this.loadData();    //For now, just load the entire list again
        });
      }
    });
    addModal.present();
    */
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.onetimeSchedules.delete(item);
  }

  clickDate(item) {
  }

  get today() {
    return this.localISODate(new Date()).slice(0,10);
  }

  setDatePickerValue() {
    this.datePickerValue = this.items[this.index].dateISO;
  }

  setIndex(index) {
    this.index = index;
    this.setDatePickerValue();
  }

  findIndexByISODate(dateISO: string): number  {
    return this.items.findIndex((item) => {
        return item.dateISO == dateISO;
    });
  }

  countItemsByISODate(dateISO: string): number  {
    return this.items.filter(item => item.dateISO == dateISO).length;
  }

  OnChangeDate() {
    let dateISO: string = this.datePickerValue.slice(0,10);
    let index = this.findIndexByISODate(this.datePickerValue);
    if (index != -1 && index != this.index) {    // cannot use date twice
      console.log('New Date is already in-use: ', this.items[this.index].dateISO);
      this.setIndex(index);    //resetting the datepicker value did not work, so as an alternative move to the found date
      return;
    }

    //set new date
    this.items[this.index].dateISO = dateISO;
    this.SortAndReselect(this.index);
  }

  private SortAndReselect(index: number) {
    let dateISO: string = this.items[index].dateISO;

    //re-sort the items per dates
    this.items.sort((a, b) => {
      return a.dateISO < b.dateISO ? -1 : 1;
    });

    //and re-find 'our' index
    this.setIndex(this.findIndexByISODate(dateISO));
  }
}
