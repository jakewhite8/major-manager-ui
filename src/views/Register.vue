<template>
  <div class="col-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
          <div class="form-group">
            <label for="team_name">Team Name</label>
            <input
              v-model="user.team_name"
              v-validate="'required|min:3|max:40'"
              type="text"
              class="form-control"
              name="team_name"
            />
            <div
              v-if="submitted && errors.has('team_name')"
              class="alert alert-danger"
            >{{errors.first('team_name')}}</div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="user.email"
              v-validate="'required|email|max:50'"
              class="form-control"
              name="email"
            />
            <div
              v-if="submitted && errors.has('email')"
              class="alert alert-danger"
            >{{errors.first('email')}}</div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="user.password"
              v-validate="'required|min:6|max:40'"
              type="password"
              class="form-control"
              name="password"
              ref="password"
            />
            <div
              v-if="submitted && errors.has('password')"
              class="alert alert-danger"
            >{{errors.first('password')}}</div>
          </div>
          <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input
              v-validate="'required|confirmed:password'"
              type="password"
              class="form-control"
              name="password_confirmation"
              data-vv-as="password"
            />
            <div
              v-if="submitted && errors.has('password_confirmation')"
              class="alert alert-danger"
            >{{errors.first('password_confirmation')}}</div>
          </div>
          <div class="form-group recaptcha-container">
            <VueRecaptcha
              :sitekey="this.recaptcha.siteKey"
              :loadRecaptchaScript="true"
              @verify="validateHuman"
              @expired="recaptchaExpire"
              @error="recaptchaError" />
            <div
              v-if="submitted && !recaptcha.verified"
              class="alert alert-danger"
            >{{recaptcha.message}}</div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary-dark-blue btn-block">Sign Up</button>
          </div>
        </div>
      </form>
      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message}}</div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';
import VueRecaptcha from 'vue-recaptcha';
import UserService from '../services/user.service'

export default {
  name: 'Register',
  data() {
    return {
      user: new User('', '', ''),
      submitted: false,
      successful: false,
      message: '',
      recaptcha : {
        siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEYS,
        verified: false,
        message: 'Verify Intentions'
      }
    };
  },
  components: {
    VueRecaptcha
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid && this.recaptcha.verified) {
          this.$store.dispatch('auth/register', this.user).then(
            (data) => {
              this.message = data.message;
              this.successful = true;
              this.$router.push('/login');
            },
            (error) => {
              this.message = (error.response && error.response.data)
                || error.message
                || error.toString();
              this.successful = false;
            },
          );
        } else if (!this.recaptcha.verified) {
          this.recaptcha.message = 'Verify Intentions'
        } 
      });
    },
    validateHuman(response) {
      UserService.validateHuman({Response: response}).then(result => {
        this.recaptcha.verified = true;
        this.recaptcha.message = '';
      }).catch(error => {
        this.recaptcha.verified = false;
        this.recaptcha.message = 'Error Validating';
      })
    },
    recaptchaExpire() {
      this.recaptcha.verified = false
      this.recaptcha.message = 'Verification Expired'
    },
    recaptchaError() {
      this.recaptcha.verified = false
      this.recaptcha.message = 'Verification Error'
    }
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
button.btn-primary-dark-blue {
  background-color: #343a40;
  border-color: #343a40;
  color: rgba(255,255,255,.75);
}
button.btn-primary-dark-blue:hover {
  color: white;
}

.recaptcha-container {
  overflow: overlay;
}
</style>
