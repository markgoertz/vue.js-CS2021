<template>
  <v-app>
    <v-app>
      <v-app-bar app color="primary" dark>
        <div class="d-flex align-center">
          <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.discordapp.com/attachments/768053758047289394/834755419330838557/Schermafbeelding_2021-04-22_092835.png" transition="scale-transition" width="80"/>
        </div>
      </v-app-bar>
      <v-content>
        <v-container fluid>
          <v-row class="fill-height">
            <v-col>
              <transition name="fade">
                <router-view></router-view>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
      <v-footer>
      </v-footer>
    </v-app>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
  }),

  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
<style>
p {
  color: black;
}
</style>
