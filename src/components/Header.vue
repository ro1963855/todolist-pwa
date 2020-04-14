<template>
  <nav class="tl-header">
    <ul class="tl-header__tabs">
      <li
        class="tl-header__tabs__item"
        :class="{'tl-header__tabs__item--active': currentTab === tab}"
        v-for="tab in tabs"
        :key="`header_${tab}`"
        @click="test(tab)"
      >{{ tab }}</li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  @Prop({ required: true }) private readonly tabs!: Array<string>;

  @Prop() private currentTab!: string;

  public test(tab: string): void {
    this.$emit('update:currentTab', tab);
  }
}
</script>

<style lang="scss" scoped>
  $height: 76px;
  .tl-header {
    display: flex;
    height: $height;
    width: 100%;
    background: #4A90E2;

    &__tabs {
      display: inline-block;
      margin: 0 auto;
      padding: 0;
      list-style-type: none;

      &__item {
        cursor: pointer;
        display: inline-block;
        width: 220px;
        text-align: center;
        line-height: $height;
        font-family: Roboto-Medium;
        font-size: 24px;
        color: #00408B;
        text-align: center;

        &--active {
          color: #FFFFFF;

          &::after {
            display: block;
            content: '';
            width: 160px;
            height: 5px;
            background: #00408B;
            margin: 0 auto;
            transform: translate(0, -5px);
          }
        }
      }
    }
  }
</style>
