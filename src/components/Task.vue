<template>
  <li class="tl-task" :class="{'tl-task--open': isEdit}">
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
        class="tl-task__header__icon tl-task__header__favorite"
        :icon="['far', 'star']"
        @click="changeFavorite(true)"
      />
      <font-awesome-icon
        v-if="isFavorite"
        class="tl-task__header__icon tl-task__header__favorite"
        :class="{'tl-task__header__favorite--active': isFavorite}"
        icon="star"
        @click="changeFavorite(false)"
      />
      <font-awesome-icon
        class="tl-task__header__icon tl-task__header__edit"
        :class="{'tl-task__header__edit--active': isEdit}"
        icon="pencil-alt"
        @click="isEdit = !isEdit"
      />
      <font-awesome-icon
        v-if="!isAddMode"
        class="tl-task__header__icon"
        icon="trash-alt"
        @click="delte"
      />
    </div>
    <div class="tl-task__content">
      <div class="tl-task__content__wrapper">
        <div class="tl-task__content__wrapper__comment">
          <font-awesome-icon :icon="['far', 'comment-dots']"/>
          Comment
        </div>
        <textarea
          ref="textarea"
          class="tl-task__content__wrapper__area"
          :value="description"
          @change="changeDescription"
        ></textarea>
      </div>
      <div class="tl-task__content__action">
        <button
          class="tl-task__content__action__button tl-task__content__action__button__cancel"
          @click="cancel"
        >
          <font-awesome-icon class="tl-task__content__action__button__icon" icon="times"/>
          Cancel
        </button>
        <button
          class="tl-task__content__action__button tl-task__content__action__button__save"
          @click="save"
        >
          <font-awesome-icon class="tl-task__content__action__button__icon" icon="plus"/>
          {{ isAddMode ? 'Add Task' : 'Save' }}
        </button>
      </div>
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
  @Prop() private id!: string;

  @Prop() private title!: string;

  @Prop() private description!: string;

  @Prop() private isFavorite!: boolean;

  @Prop() private isFinished!: boolean;

  @Prop({ default: false }) private isAddMode!: boolean;

  private isEdit = false;

  private changeFavorite(isFavorite: boolean) {
    this.$emit('update:attribute', this.id, 'isFavorite', isFavorite);
  }

  private changeFinished(event: any) {
    this.$emit('update:attribute', this.id, 'isFinished', event.target.checked);
  }

  private changeTitle(event: any) {
    this.$emit('update:attribute', this.id, 'title', event.target.value);
  }

  private changeDescription(event: any) {
    if (this.isAddMode) {
      this.$emit('update:attribute', this.id, 'description', event.target.value);
    }
  }

  private cancel() {
    this.isEdit = false;
    if (this.isAddMode) {
      this.$emit('reset:task');
    }
  }

  private save() {
    this.isEdit = false;
    if (this.isAddMode) {
      this.$emit('add:task');
    } else {
      this.$emit('update:attribute', this.id, 'description', this.$refs.textarea.value);
    }
  }

  private delte() {
    if (confirm('Are you sure?')) {
      this.$emit('delete:task', this.id);
    }
  }
}
</script>

<style lang="scss" scoped>
  .tl-task {
    margin: 0 auto;
    max-width: 620px;
    overflow: hidden;
    border-radius: 5px;
    height: 76px;
    transition: height 0.4s;

    &--open {
      height: 346px;
    }

    &__header {
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

      &__icon {
        height: 24px;
        width: 24px;
        cursor: pointer;
        & + & {
          margin-left: 32px;
        }
      }

      &__favorite {
        margin-left: auto;
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

    &__content {
      display: flex;
      flex-direction: column;
      height: 270px;
      width: 100%;
      background: #F2F2F2;
      border-top: 2px solid #C8C8C8;

      &__wrapper {
        height: 100%;
        padding: 24px 72px 0;

        &__comment {
          font-family: Roboto-Medium;
          font-size: 20px;
        }

        &__area {
          width: 100%;
          height: 120px;
          margin: 8px 25px 0;
          padding: 8px 16px;
          border: 0;
          resize: none;
          font-family: Roboto-Regular;
          font-size: 16px;
          line-height: 24px;
        }
      }

      &__action {
        margin-top: auto;
        width: 100%;

        &__button {
          cursor: pointer;
          display: inline-block;
          width: 50%;
          height: 60px;
          font-family: Roboto-Regular;
          font-size: 24px;
          text-align: center;
          border: 0;
          &:focus {
            outline: 0;
          }

          &__cancel {
            background: white;
            color: #D0021B;
          }

          &__save {
            background: #4A90E2;
            color: white;
          }

          &__icon {
            width: 14px;
            margin-right: 14px;
          }
        }
      }
    }
  }
</style>
