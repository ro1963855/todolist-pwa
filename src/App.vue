<template>
  <div id="app">
    <TlHeader :tabs="tabs" :currentTab.sync="currentTab"/>
    <div class="main">
      <ul class="list">
        <TlTask
          v-if="currentTab === 'My Tasks'"
          :isAddMode="true"
          :id="newTask.id"
          :title.sync="newTask.title"
          :description.sync="newTask.description"
          :isFinished.sync="newTask.isFinished"
          :isFavorite.sync="newTask.isFavorite"
          @reset:task="newTask = { ...emptyTask }"
          @add:task="addTask"
        />
        <TlTask
          v-for="task in showTasks"
          :key="`main${_uid}_${task.id}`"
          :id="task.id"
          :title.sync="task.title"
          :description.sync="task.description"
          :isFinished.sync="task.isFinished"
          :isFavorite.sync="task.isFavorite"
          @delete:task="deleteTask"
        />
      </ul>
      <div v-if="!isLoading" class="task_counter">{{ taskCount }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import TlHeader from './components/Header.vue';
import TlTask from './components/Task.vue';

interface Task {
  id: string;
  title: string;
  description: string;
  isFinished: boolean;
  isFavorite: boolean;
  updateTime: string;
}

@Component({
  components: {
    TlHeader,
    TlTask,
  },
})
export default class App extends Vue {
  private tabs: Array<string> = ['My Tasks', 'In Progress', 'Completed']

  private currentTab = ''

  private tasks: Array<Task> = []

  private isLoading = true

  private emptyTask: Task = {
    id: '',
    title: '',
    description: '',
    isFinished: false,
    isFavorite: false,
    updateTime: '',
  };

  private newTask: Task = {
    id: '',
    title: '',
    description: '',
    isFinished: false,
    isFavorite: false,
    updateTime: '',
  };

  get taskCount(): string {
    if (this.currentTab === 'Completed') {
      return `${this.showTasks.length} task completed`;
    }

    return `${this.showTasks.length} tasks left`;
  }

  get showTasks(): Array<Task> {
    if (this.currentTab === 'My Tasks') {
      return this.tasks;
    }

    if (this.currentTab === 'In Progress') {
      return this.tasks.filter((task) => !task.isFinished);
    }

    if (this.currentTab === 'Completed') {
      return this.tasks.filter((task) => task.isFinished);
    }

    return this.tasks;
  }

  created() {
    [this.currentTab] = this.tabs;
    axios.get('/api/tasks')
      .then((response) => {
        this.tasks = response.data;
        this.tasks.forEach((task) => {
          this.$watch(() => task, this.syncTaskToDatabase, { deep: true });
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private syncTaskToDatabase(newVal: Task) {
    const updateTask = { ...newVal };
    updateTask.updateTime = new Date().getTime().toString();
    axios.put(
      `/api/tasks/${newVal.id}`,
      updateTask,
    );
  }

  private deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    axios.delete(`/api/tasks/${id}`);
  }

  private addTask() {
    const currentTimestamp = new Date().getTime().toString();
    this.newTask.id = currentTimestamp;
    this.newTask.updateTime = currentTimestamp;
    this.tasks = [...this.tasks, this.newTask];
    axios.post('/api/tasks', this.newTask);
    this.newTask = { ...this.emptyTask };
    this.$watch(() => this.tasks[this.tasks.length - 1], this.syncTaskToDatabase, { deep: true });
  }
}
</script>

<style lang="scss">
*,
*::before,
*::after {
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
  padding: 0 40px;
  & > .tl-task + .tl-task {
    margin-top: 24px;
  }
}

.task_counter {
  font-style: italic;
  font-size: 24px;
  color: #C8C8C8;
  max-width: 620px;
  margin: 0 auto;
  padding-left: 33px;
  margin-top: 8px;
}
</style>
