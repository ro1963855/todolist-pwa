<template>
  <div id="app">
    <Header :tabs="tabs" :currentTab.sync="currentTab"/>
    <div class="main">
      <ul class="list">
        <Task
          v-for="task in tasks"
          :key="`main${_uid}_${task.id}`"
          :title.sync="task.title"
          :isFinished.sync="task.isFinished"
          :isFavorite.sync="task.isFavorite"
        />
      </ul>
      <div class="task_counter">{{ taskCount }} tasks left</div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';
import Task from './components/Task.vue';

@Component({
  components: {
    Header,
    Task,
  },
})
export default class App extends Vue {
  private tabs: Array<string> = ['My Tasks', 'In Progress', 'Completed']

  private currentTab = ''

  private tasks: Array<object> = []

  get taskCount(): number {
    return this.tasks.length;
  }

  created() {
    [this.currentTab] = this.tabs;
    axios.get('http://localhost:3000/tasks')
      .then((response) => {
        console.log(response.data);
        this.tasks = response.data;
      });
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #E1E1E1;
}

.main {
  padding: 22px 0 27px;
}

.list {
  list-style-type: none;
  margin: 0;
  & > .tl-task + .tl-task {
    margin-top: 24px;
  }
}

.task_counter {
  font-family: Roboto-Italic;
  font-style: italic;
  font-size: 24px;
  color: #C8C8C8;
  max-width: 620px;
  margin: 0 auto;
  padding-left: 33px;
  margin-top: 8px;
}
</style>
