<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list nav dense>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.link">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="blue-grey darken-4" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <div class="d-flex align-center">
        <v-img
          alt="LG Craft Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="100"
        />
      </div>
      <div>{{this.$route.name}}</div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {

  name: 'App',

  components: {

  },

  data: () => ({
    drawer: null,
    item: 0,
    items: [
      { text: 'DashBoard', icon: 'mdi-view-dashboard', link: '/dashboard' },
      { text: '자유 리그', icon: 'mdi-test-tube', link: '/league/free' }, //자유 입력
      { text: '개인 리그', icon: 'mdi-podium-gold', link: '/league/group/1' }, //티어별 조 리그
      { text: '팀 리그', icon: 'mdi-nuke', link: '/league/team/1' }, //멸망전, 학예회
      { text: '전적 입력', icon: 'mdi-upload', link: '/about3' },
      { text: 'Ranking', icon: 'mdi-sort-numeric-ascending ', link: '/ranking/all/0' },
      { text: '관리', icon: 'mdi-cog', link: '/about5' },
    ],
  }),

  methods: {
    getAllPlayers() {
      this.$lcordAPI.user.getSortedAllUsers({ key: 'eloScore', order: 'desc' })
    },
  },

  beforeMount() {
    this.getAllPlayers()
  },
}
</script>

<style>
  body {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  body::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
</style>
