/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or a "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
export class IO {
  pk: number;
  ph_sn: string;
  ph_index: number;
  description: string;
  model: string;
  type: string;
  tags: string[];
  state: boolean;

  static generate_id(model: string, pk: number) {
    return model + "." + pk;
  }

  constructor(model: string, json: object) {
    this.pk = +json['pk'];
    this.model = model;
    this.type = json['type'];
    this.description = json['description'];
    this.tags = json['tags'];
    this.state = json['state'];
    this.ph_sn = json['ph_sn'];
    this.ph_index = json['ph_index'];
    //this.tags = tags.split(',');
  }

  get id(): string {
    return IO.generate_id(this.model, this.pk);
  }

  get image(): string{
    return undefined;
  }

  get image_green(): string {
    return "assets/img/statebutton/button_green_dark.png";
  }

  get image_red(): string {
    return "assets/img/statebutton/button_red_dark.png";
  }

  get image_gray(): string {
    return "assets/img/statebutton/button_gray_dark.png";
  }
}

export class Input extends IO {
  public static model: string = 'ios.models.Input';     //Same model as Django

  //constructor(private fields: any) {
    // Quick and dirty extend/assign fields to this model
    //for(let f in fields) {
    //  this[f] = fields[f];
    //}
  //}

  constructor(json: object) {
    super(Input.model, json);
  }

  get image(): string{
    //console.log('INPUT-STATE ', this.pk, ':', this.state, this.state === undefined, this.state===null);

    switch (this.type) {
      case 'Toggle':
      case 'Push':
        return this.state ? this.image_green : this.image_gray;
      case 'Magnet':
      case 'Sonic':
        if (this.state === null) return this.image_gray; else return this.state ? this.image_green : this.image_red;
    }
  }
}

export class Output extends IO {
  //output_type: number;
  public static model: string = 'ios.models.Output';     //Same model as Django
  public supports_schedules: boolean;
  public permissions: string[];

  constructor(json: object) {
    super(Output.model, json);
    this.supports_schedules = json['supports_schedules']
    this.permissions = json['permissions']
    console.log(this);
  }

  get image(): string{
    //console.log('OUTPUT-STATE ', this.pk, ':', this.state, this.state === undefined, this.state===null);

    switch (this.type) {
      case 'Relay':
      case 'Blind Up':
      case 'Blind Down':
      case 'Script':
        return this.state ? this.image_green : this.image_gray;
      case 'Alarm':
        if (this.state === null) return this.image_gray; else return this.state ? this.image_green : this.image_red;
    }
  }
}


export class Tag {
  public name: string;
  public ios: IO[];

  constructor(name: string) {
    this.name = name;
    this.ios = [];
  }
}

export class DjangoChannelPayload {
  action: string;
  model: string;
  pk: string;
  data: any;

  constructor(action: string, model:string, pk: string, data: object) {
    this.action = action;
    this.model = model;
    this.pk = pk;
    this.data = data;
  }
}

export class DjangoChannelMessage {
  stream: string;
  payload: DjangoChannelPayload;

  constructor(stream: string, payload: DjangoChannelPayload) {
    this.stream = stream;
    this.payload = payload;
  }
}



/*
export class Items {
  inputs: Input[];
  outputs: Output[];

  constructor(inputs: Input[], outputs: Output[]) {
    this.inputs = inputs;
    this.outputs = outputs;
  }

  get_tag_hierarchy():  Map<string, IO[]> {
    let tags_ios = new Map<string, IO[]>();
    for (let io of this.inputs) {
      for (let tag of io.tags) {
        if (tags_ios[tag] == 'undefined')
          tags_ios[tag] = new Array<IO>();
        tags_ios[tag].push(io);
      }
    }
    return tags_ios;
  }
}
*/
