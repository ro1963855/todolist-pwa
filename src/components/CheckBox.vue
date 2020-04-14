<template>
  <label class="tl-checkbox">
    <input class="tl-checkbox__input" type="checkbox" :checked="value">
    <span class="tl-checkbox__checkmark"></span>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CheckBox extends Vue {
    @Prop() private value!: boolean;
}
</script>

<style lang="scss" scoped>
.tl-checkbox {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 25px;
  height: 25px;

  &:hover > .tl-checkbox__input ~ .checkmark {
    background-color: #ccc;
  }

  > .tl-checkbox__input:checked {

    ~ .tl-checkbox__checkmark {
      background-color: #4A90E2;

      &:after {
        display: block;
      }
    }
  }

  > .tl-checkbox__input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  > .tl-checkbox__checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #ffffff;

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
}
</style>
