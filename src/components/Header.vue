<template>
  <nav class="tl-header">
    <ul class="tl-header__tabs">
      <li
        class="tl-header__tabs__item"
        :class="{'tl-header__tabs__item--active': currentTab === tab}"
        v-for="tab in tabs"
        :key="`header_${tab}`"
        @click="changeTab(tab)"
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

  public changeTab(tab: string): void {
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
        text-align: center;
        line-height: $height;
        color: #00408B;
        text-align: center;
        width: 100px;
        transition: width 0.4s;

        @media (min-width: 576px) {
          font-size: 20px;
          width: 160px;
        }

        @media (min-width: 768px) {
          font-size: 24px;
          width: 220px;
        }

        &--active {
          color: #FFFFFF;

          &::after {
            display: block;
            content: '';
            width: 60px;
            height: 5px;
            background: #00408B;
            margin: 0 auto;
            transform: translate(0, -5px);
            transition: width 0.4s;

            @media (min-width: 576px) {
              width: 130px;
            }

            @media (min-width: 768px) {
              width: 160px;
            }
          }
        }
      }
    }
  }
</style>
