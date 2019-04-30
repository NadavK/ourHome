/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or a "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
export class OnetimeSchedule {
    public id: number;
    public active: boolean;
    private date: string;
    public start: string;
    public end: string;
    public segments: string;
    public output: number;

  constructor(obj: Object){
      this.id=+obj['id'];
      this.active=(obj['active'] || true);
      //this.date = new Date(obj['date']);
      this.date = obj['date'];
      this.start= obj['start'];
      this.end= obj['end'];
      this.segments=(obj['segments'] || Array(96+1).join("0"));
      this.output=obj['output'];
  }

  get dateISO(): string {
    return this.date.slice(0,10);
  }

  set dateISO(dateISO: string) {
    this.date = dateISO.slice(0,10);
  }

  private calc_hours(time): number {
      return +time.slice(0,2);
  }

  private calc_minutes(time): number {
      return +time.slice(3,5);
  }

  private calc_segment(time): number {
      return this.calc_hours(time) * 4 + Math.floor(this.calc_minutes(time)/15);
  }

  get start_segment(): number {
      return this.calc_segment(this.start);
  }

  get end_segment(): number {
      return this.calc_segment(this.end);
  }

  public color(h, m):string {
      let segment = h*4 + m;
      if ((segment < this.start_segment) || (segment > this.end_segment)) return '#EEEEEE';
      else return this.segments[segment]=='1' ? '#019103' : '#BBBBBB';
  }

  setAllOn() {
    this.segments = Array(96+1).join("1")
  }
  setAllOff() {
    this.segments = Array(96+1).join("0")
  }

  /*constructor(private fields: any) {
    // Quick and dirty extend/assign fields to this model
    for(let f in fields) {
      this[f] = fields[f];
    }
  }*/

}
