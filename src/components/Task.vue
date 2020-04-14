<template>
  <li class="tl-task">
    <div class="tl-task__header">
      <CheckBox @change.native="changeFinished" :value="isFinished"/>
      <input
        type="text"
        class="tl-task__header__title"
        :class="{'tl-task__header__title--finished': isFinished}"
        :value="title"
        @change="changeTitle"
      >
      <font-awesome-icon
        v-if="!isFavorite"
        class="tl-task__header__favorite"
        :icon="['far', 'star']"
        @click="changeFavorite(true)"
      />
      <font-awesome-icon
        v-else
        class="tl-task__header__favorite"
        :class="{'tl-task__header__favorite--active': isFavorite}"
        icon="star"
        @click="changeFavorite(false)"
      />
      <font-awesome-icon
        class="tl-task__header__edit"
        :class="{'tl-task__header__edit--active': isEdit}"
        icon="pencil-alt"
        @click="isEdit = !isEdit"
      />
    </div>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CheckBox from './CheckBox.vue';

@Component({
  components: {
    CheckBox,
  },
})
export default class Task extends Vue {
  @Prop() private title!: string;

  @Prop() private isFavorite!: boolean;

  @Prop() private isFinished!: boolean;

  private isEdit = false;

  public changeFavorite(isFavorite: boolean) {
    this.$emit('update:isFavorite', isFavorite);
  }

  private changeFinished(event: any) {
    this.$emit('update:isFinished', event.target.checked);
  }

  private changeTitle(event: any) {
    this.$emit('update:title', event.target.value);
  }
}
</script>

<style lang="scss" scoped>
  .tl-task {
    margin: 0 auto;
    max-width: 620px;
    overflow: hidden;
    border-radius: 5px;

    &__header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 76px;
      width: 100%;
      background: #F2F2F2;
      padding: 24px 32px;

      > .tl-checkbox {
        margin-right: 16px;
      }

      &__title {
        box-sizing: border-box;
        font-family: Roboto-Medium;
        font-size: 24px;
        color: black;
        width: 100%;
        margin-right: 16px;
        height: 28px;
        border: 0;
        background: transparent;

        &--finished {
          color: #9B9B9B;
          text-decoration: line-through;
        }
      }

      &__favorite, &__edit {
        height: 24px;
        width: 24px;
        cursor: pointer;
      }

      &__favorite {
        margin-left: auto;
        margin-right: 32px;
        &--active {
          color: #F5A623;
        }
      }

      &__edit {

        &--active {
          color: #4A90E2;
        }
      }
    }
  }
</style>
