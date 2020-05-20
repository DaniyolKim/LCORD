<template>
  <modal name="loading-modal"
         classes="cute-dog-profile-photo"
         :clickToClose="clickToClose"
         :height="height"
         :width="width"
         >
    <div slot="top-right" class="ct-top-right" @click="closeLoading">close</div>
    <b-spinner variant="primary" label="Spinning"></b-spinner>
    <!--<img class="loading-img" src="../../assets/spinner.gif" />-->
  </modal>
</template>
<script>
  export default {
    name: 'loadingModal',
    props: {
      width: {
        type: [Number, String],
        default: 256
      },
      height: {
        type: [Number, String],
        default: 256
      },
      clickToClose: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      closeLoading () {
        this.$modal.hide('loading-modal')
      }
    }
  }
</script>
<style>
  .cute-dog-profile-photo {
    background-color: transparent;
    z-index: 9999;
    /*border-radius: 100%;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.65);*/
  }
  .loading-img {
    width: 256px;
    height: 256px;
  }

  .ct-top-right {
    cursor: pointer;
    padding-top: 20px;
    padding-right: 30px;
    font-weight: 600;
    color: white;
    text-shadow: 0 0px 20px black;
  }

  .scale-enter-active,
  .scale-leave-active {
    transition: all 0.5s;
  }

  .scale-enter,
  .scale-leave-active {
    opacity: 0;
    transform: scale(0.3) translateY(24px);
  }
</style>
