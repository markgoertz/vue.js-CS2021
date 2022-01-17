<template>
  <v-card width="700" class="mx-auto mt-5" style='margin-top:30%'>
    <v-card-title class="pb-0">
      <h1>Login</h1>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
            label="Username"
            v-model="loginform.username"
            prepend-icon="mdi-account-circle"
            name="usernametxtbox"
        />
        <v-text-field
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            name="passwordtxtbox"
            v-model="loginform.password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
        />
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="success" class="mx-auto mx-5" style="width: 330px" @click="AuthenticationAttempt" name="loginButton">Log in!</v-btn>
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
  data () {
    return {
      showPassword: false,
      loginform:{
        username:'',
        password:''
      }
    }
  },

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
