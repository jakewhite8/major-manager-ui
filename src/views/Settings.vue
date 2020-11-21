<template>
  <div class="container light-style flex-grow-1 container-p-y">
    <header class="jumbotron">
      <h3>Account Settings</h3>
    </header>
    <div class="card overflow-hidden">
      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'">
        {{message}}
      </div>
      <div class="row no-gutters row-bordered row-border-light">
        <div class="col-md-3 pt-0">
          <div class="list-group list-group-flush account-settings-links settings-sidebar">
            <a class="list-group-item list-group-item-action active" data-toggle="list" href="#account-general">General</a>
            <!-- <a class="list-group-item list-group-item-action" data-toggle="list" href="#account-change-password">Change password</a> -->
            <!-- <a class="list-group-item list-group-item-action" data-toggle="list" href="#account-notifications">Notifications</a> -->
          </div>
        </div>
        <div class="col-md-9">
          <div class="tab-content">
            <div class="tab-pane fade active show" id="account-general">
              <hr class="border-light m-0">
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Team Name</label>
                  <input
                    class="form-control"
                    v-model="currentUser.team_name"
                    v-validate="'required|min:3|max:40'"
                    name="team_name"
                    @change="textInputChange('team_name')">
                  <div
                    v-if="submitted && errors.has('team_name')"
                    class="alert-danger error-settings-page">
                    {{errors.first('team_name')}}
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">E-mail</label>
                  <input
                    class="form-control"
                    v-model="currentUser.email"
                    v-validate="'required|email|max:50'"
                    type="email"
                    name="email"
                    @change="textInputChange('email')">
                  <div
                    v-if="submitted && errors.has('email')"
                    class="alert-danger error-settings-page">
                    {{errors.first('email')}}</div>
                </div>
              </div>
            </div>
            <!-- <div class="tab-pane fade" id="account-change-password">
              <div class="card-body pb-2">
                <div class="form-group">
                  <label class="form-label">Current password</label>
                  <input type="password" class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">New password</label>
                  <input type="password" class="form-control">
                </div>
                <div class="form-group">
                  <label class="form-label">Repeat new password</label>
                  <input type="password" class="form-control">
                </div>
              </div>
            </div> -->
            <!-- <div class="tab-pane fade" id="account-notifications">
              <div class="card-body pb-2">
                <h6 class="mb-4">Activity</h6>
                <div class="form-group">
                  <label class="switcher">
                    <input type="checkbox" class="switcher-input" checked="">
                    <span class="switcher-indicator">
                      <span class="switcher-yes"></span>
                      <span class="switcher-no"></span>
                    </span>
                    <span class="switcher-label">Email me when someone comments on my article</span>
                  </label>
                </div>
                <div class="form-group">
                  <label class="switcher">
                    <input type="checkbox" class="switcher-input" checked="">
                    <span class="switcher-indicator">
                      <span class="switcher-yes"></span>
                      <span class="switcher-no"></span>
                    </span>
                    <span class="switcher-label">Email me when someone answers on my forum thread</span>
                  </label>
                </div>
                <div class="form-group">
                  <label class="switcher">
                    <input type="checkbox" class="switcher-input">
                    <span class="switcher-indicator">
                      <span class="switcher-yes"></span>
                      <span class="switcher-no"></span>
                    </span>
                    <span class="switcher-label">Email me when someone follows me</span>
                  </label>
                </div>
              </div>
              <hr class="border-light m-0">
              <div class="card-body pb-2">
                <h6 class="mb-4">Application</h6>
                <div class="form-group">
                  <label class="switcher">
                    <input type="checkbox" class="switcher-input" checked="">
                    <span class="switcher-indicator">
                      <span class="switcher-yes"></span>
                      <span class="switcher-no"></span>
                    </span>
                    <span class="switcher-label">News and announcements</span>
                  </label>
                </div>
                <div class="form-group">
                  <label class="switcher">
                    <input type="checkbox" class="switcher-input">
                    <span class="switcher-indicator">
                      <span class="switcher-yes"></span>
                      <span class="switcher-no"></span>
                    </span>
                    <span class="switcher-label">Weekly product updates</span>
                  </label>
                </div>
                <div class="form-group">
                  <label class="switcher">
                    <input type="checkbox" class="switcher-input" checked="">
                    <span class="switcher-indicator">
                      <span class="switcher-yes"></span>
                      <span class="switcher-no"></span>
                    </span>
                    <span class="switcher-label">Weekly blog digest</span>
                  </label>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="text-right mt-3">
      <button
        type="button"
        v-on:click="saveChanges()"
        :disabled="loading"
        class="btn btn-primary-dark-blue">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        <span>Save changes</span>
      </button>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'Settings',
  data() {
    return {
      changeTeamName: false,
      changeEmail: false,
      changePassword: false,
      originalCurrentUser: {},
      successful: false,
      message: '',
      loading: false,
      submitted: false
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    saveChanges() {
      this.submitted = true;
      this.loading = true;
      if (this.changeEmail || this.changeTeamName) {
        // run validator
        // need to make sure fields are not blank
        // make sure emails are not duplicates
        // make sure emails are correct format

        this.$validator.validate().then((isValid) => {
          if (isValid) {
            // Update this.$store.state.auth.user
            this.$store.dispatch('auth/updateUserInfo', this.currentUser).then(
              () => {
                this.successful = true;
                this.message = 'Update Successful';
                this.changeTeamName = false;
                this.changeEmail = false;
                this.changePassword = false;
                for (let prop in this.currentUser) {
                  this.originalCurrentUser[prop] = this.currentUser[prop];
                }
                this.loading = false;
              }, (error) => {
                this.successful = false;
                this.message = 'Update Unsuccessful'
                this.loading = false;
              }
            )

          }
        })
      }
      this.loading = false;
    },
    textInputChange(field) {
      // remove succes or error messages
      this.message = '';
      this.successful = false;
      this.submitted = false;

      switch (field) {
        case 'team_name':
          if (this.currentUser.team_name != this.originalCurrentUser.team_name) {
            this.changeTeamName = true;
          } else {
            this.changeTeamName = false;
          }
          break
        case 'email':
          if (this.currentUser.email != this.originalCurrentUser.email) {
            this.changeEmail = true;
          } else {
            this.changeEmail = false;
          }
          break
      }
    }
  },
  mounted() {
    // Need deep copy of the current user
    for (let prop in this.$store.state.auth.user) {
      this.originalCurrentUser[prop] = this.$store.state.auth.user[prop];
    }
  },
};
</script>
<style>
  a.active {
    background-color: #343a40 !important;
    border-color: #343a40 !important;
    color: rgba(255,255,255,.75) !important;
    font-weight: bold !important;
  }
  a.active:hover {
    color: white !important;
  }
  button.btn-primary-dark-blue {
    background-color: #343a40;
    border-color: #343a40;
    color: rgba(255,255,255,.75);
  }
  button.btn-primary-dark-blue:hover {
    color: white;
  }
  div.error-settings-page {
    text-align: center;
    padding: 10px 0;
    margin: 10px 0;
  }
</style>