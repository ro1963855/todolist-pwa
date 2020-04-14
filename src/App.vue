<template>
  <div id="app">
    <TlHeader :tabs="tabs" :currentTab.sync="currentTab"/>
    <div class="main">
      <ul class="list">
        <TlTask
          v-if="currentTab === 'My Tasks'"
          :isAddMode="true"
          :id="newTask.id"
          :title="newTask.title"
          :description="newTask.description"
          :isFinished="newTask.isFinished"
          :isFavorite="newTask.isFavorite"
          @update:attribute="changeNewTaskAttribute"
          @reset:task="newTask = { ...emptyTask }"
          @add:task="addTask"
        />
        <TlTask
          v-for="task in showTasks"
          :key="`main${_uid}_${task.id}`"
          :id="task.id"
          :title="task.title"
          :description="task.description"
          :isFinished="task.isFinished"
          :isFavorite="task.isFavorite"
          @update:attribute="changeTaskAttribute"
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
    axios.get('http://localhost:3000/tasks')
      .then((response) => {
        this.tasks = response.data;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private changeTaskAttribute(id: string, attribute: string, newValue: any) {
    const updagteTask = this.tasks.find((task) => task.id === id);
    updagteTask[attribute] = newValue;
    axios.patch(
      `http://localhost:3000/tasks/${id}`,
      {
        [attribute]: newValue,
        updateTime: new Date().getTime().toString(),
      },
    );
  }

  private changeNewTaskAttribute(id: string, attribute: string, newValue: any) {
    this.newTask[attribute] = newValue;
  }

  private deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    axios.delete(`http://localhost:3000/tasks/${id}`);
  }

  private addTask() {
    const currentTimestamp = new Date().getTime().toString();
    this.newTask.id = currentTimestamp;
    this.newTask.updateTime = currentTimestamp;
    this.tasks = [...this.tasks, this.newTask];
    axios.post('http://localhost:3000/tasks', this.newTask);
    this.newTask = { ...this.emptyTask };
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
