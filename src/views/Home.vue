<template>
  <v-card>
    <v-data-table
        :headers="headers"
        :items="info"
        :search="search"
        loading-text="Loading... Please wait"
        :items-per-page="15"
        class="font-weight-bold text--black"
    >
      <template v-slot:top>
        <v-app-bar
            class="text-uppercase"
        >


          <v-toolbar-title  class="mx-4 text-uppercase">Product-Range</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>

          <v-spacer></v-spacer>



          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
          ></v-text-field>

          <v-spacer></v-spacer>


          <v-dialog
              v-model="dialog"
              max-width="500px"
          >
            <template v-slot:activator="{on,attrs}">
              <v-btn
                  color="secondary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"

              >
                Add new Product
              </v-btn>
            </template>

            <!--Start of the user update and delete part.-->
            <v-card>
              <v-card-title>
                <span class="headline">{{formTitle}}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form
                      v-model="valid"
                      ref="form"
                      lazy-validation
                      v-on:submit.prevent = "save"
                      >
                    <v-row>
                      <v-col
                          cols="12"
                      >
                        <v-text-field
                            v-model="editedItem.name"
                            label="brand name"
                            :rules="namerules"
                            :counter="30"
                            required
                        >
                        </v-text-field>
                      </v-col>

                      <v-col
                          cols="12"
                      >
                        <v-text-field
                            v-model="editedItem.productname"
                            label="Product name"
                            :rules="productnamerules"
                            :counter="50"
                            required
                        ></v-text-field>
                      </v-col>

                      <v-col
                          cols="12"

                      >
                        <v-text-field
                            v-model="editedItem.stocklevels"
                            :rules="[numberRule]"
                            required
                            label="stock levels"
                        >
                        </v-text-field>
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
                    v-if="formTitle === 'Add new Product'"
                    v-on:click="save"
                    :disabled="!valid"
                >
                  Save
                </v-btn>
                <v-btn
                    :disabled="!valid"
                    color="blue darken-1"
                    text
                    v-else
                    v-on:click="update(editedItem.id)"
                >
                  Update
                </v-btn>

              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text v-on:click="deleteItemConfirm(editedItem.id)">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-app-bar>

        <hr/>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn
            color="primary"
            @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import ProductMethods from "../router/Methods/ProductMethods";
import router from "../router";
import GeneralMethods from "../router/Methods/GeneralMethods";
export default {
  name: 'App',
  data: () => ({
      valid: true,
      search: '',
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: 'id', value: 'id'},
        {text: 'brand', value: 'name'},
        {text: 'product', value: 'productname'},
        {text: 'stock levels', value: 'stocklevels'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],

      info: [],

      editedIndex: -1,

      editedItem: {
        id:'',
        name: '',
        productname: '',
        stocklevels: ''
      },

      defaultItem: {
        id: '',
        name: '',
        productname: '',
        stocklevels: ''

      },

    namerules:[
      v => !!v || 'this is required',
      v => (v && v.length <= 30) || 'name must be less than 30 characters',
    ],

    productnamerules: [
      v => !!v || 'this is required',
      v => (v && v.length <= 50) || 'name must be less than 50 characters',
    ],

    numberRule:  v  => {
      if (!v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0 && v <= 999) return true;
      return 'Number has to be between 0 and 999';
    }


  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add new Product' : 'Edit Product '
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  mounted() {
    ProductMethods.GetAllProducts()
        .then(response => {
          this.info = response.data
        })
        .catch(function (error) {
          console.log(error.status);
          if (error.response.status === 401) {
            router.push("/login")
          }
        })
  },
  methods: {


    initialize() {
      this.info = []
    },

    editItem(item) {
      this.editedIndex = this.info.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.info.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm(id) {
      ProductMethods.DeleteProduct(id)
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
            else if(error.response.status === 401){
              router.push("/product")
            }
            else{
              GeneralMethods.FailedExceptionWithSwal();
            }
          })
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.info[this.editedIndex], this.editedItem)
      } else {
        // this.info.push(this.editedItem)
        ProductMethods.CreateProduct(this.editedItem)
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

    update(id) {
      if (this.editedIndex > -1) {
        ProductMethods.UpdateProduct(id,this.editedItem)
            .then(function (response) {
              console.log(response)
              GeneralMethods.SuccessNotificationWithSwal();
              window.setTimeout(function(){
                location.reload();
              } ,500);
            })
            .catch(function (error) {
              console.log(error.status);
              if(error.response.status===(403)){
                GeneralMethods.ThrowUnauthenticatedException();
              }
              else{
                router.push("/product")
              }
            })
      }

      else
      {
        Object.assign(this.info[this.editedIndex], this.editedItem)
      }
    }
  }
};
</script>
