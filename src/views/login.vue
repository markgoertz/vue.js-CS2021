<template>
  <v-card width="700" class="mx-auto mt-5" style='margin-top:30%'>
    <v-card-title class="pb-0">
      <h1>Login</h1>
    </v-card-title>
    <v-card-text>
      <v-form
          v-model="valid"
          ref="form"
          lazy-validation
      >
        <v-text-field
            label="Username"
            :rules="emailRules"
            required
            v-model="loginform.username"
            prepend-icon="mdi-account-circle"
            name="usernametxtbox"
        ></v-text-field>
        <v-text-field
            label="Password"
            :counter="0"
            :rules="pwrules"
            :type="showPassword ? 'text' : 'password'"
            name="passwordtxtbox"
            v-model="loginform.password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
          color="success"
          class="mx-auto mx-5"
          style="width: 330px"
          @click="AuthenticationAttempt"
          name="loginButton"
          :disabled="!valid"
      >
        Log in!
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'
import router from "../router";
import Home from "./Home"

export default {
  name: "Login",
  data: () => ({
        valid: true,
        showPassword: false,
        loginform:{
        username:'',
        password:''
      },
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password:'',
    pwrules: [
      v => !!v || 'password is required',
      v => (v && v.length >= 8) || 'Password must be more than 8 characters',
    ]
  }),



  methods:{

    AuthenticationAttempt(){
      axios.post('http://localhost:8080/authenticate', this.loginform,{
        headers:{
          Authorization:null
        }
      })
          .then(function (response) {
            //SAVE JWT TO LOCAL STORAGE
            localStorage.setItem('token', response.data.token);
            console.log("JWT Token: " + response.data.token);

            //TRY AND LOG IN WITH JWT AS HEADER
            axios.get('http://localhost:8080/login', {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
              }
            })
                .then(function (response) {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Successfully logged in.',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  console.log(response);
                  router.push(Home);
                  window.setTimeout(function(){
                    location.reload();
                  } ,2000);

                })
          })
          .catch(function (response) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              name:'ErrorSWAL',
              text: 'Login has failed.',
            })
            console.log(response);
            console.log("login failed");
          })

    }
  }
}
</script>

<style scoped>

</style>
