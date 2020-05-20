/* eslint camelcase: ["error", {allow: ['team_name']}] */
export default class User {
  constructor(team_name, email, password) {
    this.team_name = team_name;
    this.email = email;
    this.password = password;
  }
}
