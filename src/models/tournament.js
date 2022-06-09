/* eslint camelcase: "off" */
export default class Tournament {
  constructor(name, id, start_date, round) {
    this.name = name;
    this.id = id;
    this.start_date = start_date;
    this.round = round;
  }
}
