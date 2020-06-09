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

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
      <!--<HelloWorld/>-->
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: null,
    item: 0,
    items: [
      { text: '대쉬 보드', icon: 'mdi-view-dashboard', link: '/about' },
      { text: '개인 리그', icon: 'mdi-folder', link: '/about1' },
      { text: '팀 리그', icon: 'mdi-account-multiple', link: '/about2' },
      { text: '전적 입력', icon: 'mdi-upload', link: '/about3' },
      { text: '랭킹', icon: 'mdi-history', link: '/about4' },
      { text: '관리', icon: 'mdi-check-circle', link: '/about5' },
    ],
  }),
};
</script>
