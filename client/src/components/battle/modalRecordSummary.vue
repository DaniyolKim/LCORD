<template>
  <div class="modal-root">
    <h2>{{user.userName}}님의 전적</h2>
    <div class="contents-container">
      <div>
        <h3>Summary</h3>
        <div>TOTAL : {{strSummary(summary.total)}}</div>
        <div>vs Zerg : {{strSummary(summary.vsZerg)}}</div>
        <div>vs Terran : {{strSummary(summary.vsTerran)}}</div>
        <div>vs Protoss : {{strSummary(summary.vsProtoss)}}</div>
        <!--<div>최다 승 : </div>
        <div>최다 패 : </div>-->
      </div>

      <hr>

      <vue-record-list style="width: 100%;" :record-list="recordList" :show-battle-name="false"/>
    </div>
    <button @click="closeModal">CLOSE</button>
  </div>
</template>

<script>
  import VueRecordList from "../module/vueRecordList";
  export default {
    name: "modal_record_summary",
    components: { VueRecordList },
    props: ['user', 'recordList', 'summary'],
    data () {
      return {
      }
    },
    methods: {
      strSummary (vsObj) {
        let total = vsObj.winCount + vsObj.loseCount
        return total + '전 ' + vsObj.winCount + '승 ' + vsObj.loseCount + '패 ' + '(승률 : ' + vsObj.winRate + '%)'
      },
      closeModal () {
        this.$emit('close')
      },
    },
    mounted() {
    },
    computed: {
      maxWinUser: function () {
        
      },
      maxLoseUser: function () {
        
      }
    }
  }
</script>

<style scoped>
  .modal-root { display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; height: 100%; width: 100%; }
  .modal-root > h2 { width: 100%; }
  .contents-container { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; overflow-y: auto; }
  button { width: 100%; }
  label { width: 150px; text-align: right; margin-right: 15px; }
  input { width: 40%; font-size: 14px; }
  select { font-size: 14px; padding: 10px; border: solid 1px #e8e8e8; border-radius: 5px; width: 42.5%;}
</style>
