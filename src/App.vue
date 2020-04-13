<template>
  <div id="app">
    <Header :tabs="tabs" :currentTab.sync="currentTab"/>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import Header from './components/Header.vue';

@Component({
  components: {
    HelloWorld,
    Header,
  },
})
export default class App extends Vue {
  private tabs = ['My Tasks', 'In Progress', 'Completed']

  private currentTab = ''

  created() {
    [this.currentTab] = this.tabs;
  }
}
</script>

<style>
body {
  margin: 0;
  background: #E1E1E1;
}
</style>
