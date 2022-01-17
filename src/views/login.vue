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




<!--NEW SECTION-->
    <template>
      <v-app-bar
          class="text-uppercase"
      >
        <v-card-actions>
          <v-btn
              color="success"
              fixed
              style="width: 40%"
              @click="AuthenticationAttempt"
              name="loginButton"
              :disabled="!valid"
          >
            Log in!
          </v-btn>
        </v-card-actions>
        <v-spacer></v-spacer>

        <v-dialog
            v-model="dialog"
            max-width="500px"
        >
          <template v-slot:activator="{on,attrs}">
            <v-btn
                color="secondary"
                style="width: 40%"
                v-bind="attrs"
                v-on="on"
            >
              Register now!
            </v-btn>
          </template>

          <!--Start of the user update and delete part.-->
          <v-card>
            <v-card-title>
              <span class="headline align-end">{{formTitle}}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form
                    v-model="valid2"
                    ref="form"
                    lazy-validation
                    v-on:submit.prevent = "save"
                >
                  <v-row>
                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          v-model="editedItem.firstname"
                          label="firstname"
                          :rules="firstnamerules"
                          :counter="40"
                          required
                      >
                      </v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          v-model="editedItem.lastname"
                          label="lastname"
                          :counter="50"
                          :rules="lastnamerules"
                          required
                      ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"

                    >
                      <v-text-field
                          v-model="editedItem.email"
                          required
                          :rules="emailRules"
                          label="Email"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                    >
                      <v-text-field
                          v-model="editedItem.password"
                          label="Password"
                          :counter="20"
                          :rules="pwdRules"
                          required
                      ></v-text-field>
                    </v-col>

                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  v-if="formTitle === 'Register now!'"
                  v-on:click="save"
                  :disabled="!valid2"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app-bar>

    </template>

  </v-card>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'
import router from "../router";
import Home from "./Home"
import UserMethod from "../router/Methods/UserMethod";
import GeneralMethods from "../router/Methods/GeneralMethods";

export default {
  name: "Login",
  data: () => ({
        valid: true,
        valid2:true,
        dialog: false,
        showPassword: false,
        loginform:{
        username:'',
        password:''
      },
      editedIndex: -1,

      editedItem: {
        id:'',
        firstname: '',
        lastname: '',
        email: '',
        password: null
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
    ],
    lastnamerules:[
      v => !!v || 'this is required',
      v => (v && v.length <= 50) || 'name must be less than 50 characters',
    ],
    firstnamerules:[
      v => !!v || 'this is required',
      v => (v && v.length <= 40) || 'name must be less than 40 characters',
    ],

    passwordRules:[
      v => (v && v.length >= 8) || 'Password must have 8+ characters',
      v => (v && v.length <= 20) || 'Password must have less then 20+ characters',
    ],


    passwordRequirements: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,32}$/,
    pwdRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must have 8+ characters',
      v => (v && v.length <= 20) || 'Password must have less then 20+ characters',
      v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
      v => /(?=.*\d)/.test(v) || 'Must have one number',
      v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
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

    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.editedItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.info[this.editedIndex], this.editedItem)
      } else {
        // this.info.push(this.editedItem)
        UserMethod.Register(this.editedItem)
            .then(function (response) {
              console.log(response)
              GeneralMethods.SuccessNotificationWithSwal();
              window.setTimeout(function(){
                location.reload();
              } ,500);
            })
            .catch(function (error) {
              console.log(error);
              if(error.response.status===(403)){
                GeneralMethods.ThrowUnauthenticatedException();
              }
              else if (error.response.status === 401){
                router.push("/product")
              }
              else{
                GeneralMethods.FailedExceptionWithSwal();
              }
            })
      }
      this.close()
    },
  },
  computed:{
    formTitle() {
      return this.editedIndex === -1? 'Register now!' : 'Edit Account'
    }
  }
}
</script>


