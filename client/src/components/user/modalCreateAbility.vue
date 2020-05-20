<template>
  <div style="text-align: center">
    <h4>{{player.userName}}님의 능력 평가</h4>
    <div>*참고 : 0 < 아메바 < 2 < 애니멀 < 3 < 휴먼 < 4 < 갓 < 5</div>
    <div class="contents-container">
      <div class="input-area">
        <apexchart type=radar height="300px" :options="chartOptionsStats" :series="chartSeriesStats"></apexchart>
        <div class="slider-container">
          <div>
            <label class="label-ability">빌드</label><vue-slider v-bind="sliderOption" v-model="reqData.build"></vue-slider>
          </div>
          <div>
            <label class="label-ability">컨트롤</label><vue-slider v-bind="sliderOption" v-model="reqData.control"></vue-slider>
          </div>
          <div>
            <label class="label-ability">판단</label><vue-slider v-bind="sliderOption" v-model="reqData.judgement"></vue-slider>
          </div>
          <div>
            <label class="label-ability">자원관리</label><vue-slider v-bind="sliderOption" v-model="reqData.manageResource"></vue-slider>
          </div>
          <div>
            <label class="label-ability">확장능력</label><vue-slider v-bind="sliderOption" v-model="reqData.manageMulti"></vue-slider>
          </div>
        </div>
      </div>

      <div class="footer">
        <b-button @click="cancelEvaluation">취소</b-button>
        <b-button v-if="oldData != undefined" @click="delEvaluation">삭제</b-button>
        <b-button @click="addEvaluation">확인</b-button>
      </div>
    </div>
  <v-dialog/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: "modal_createAbility",
    props: ['player', 'oldData', 'abilityCount'],
    data () {
      return {
        sliderOption: {
          dotSize: 14,
          width: '200px',
          height: 4,
          contained: false,
          direction: 'ltr',
          data: null,
          min: 0,
          max: 5,
          interval: 0.1,
          disabled: false,
          clickable: true,
          duration: 0.5,
          adsorb: false,
          lazy: false,
          tooltip: 'active',
          tooltipPlacement: 'top',
          tooltipFormatter: void 0,
          useKeyboard: false,
          keydownHook: null,
          dragOnClick: false,
          enableCross: true,
          fixed: false,
          minRange: void 0,
          maxRange: void 0,
          order: true,
          marks: false,
          dotOptions: void 0,
          process: true,
          dotStyle: void 0,
          railStyle: void 0,
          processStyle: void 0,
          tooltipStyle: void 0,
          stepStyle: void 0,
          stepActiveStyle: void 0,
          labelStyle: void 0,
          labelActiveStyle: void 0,
        },
        reqData: {
          targetUser: '',
          writer: '',
          build: 0,
          control: 0,
          judgement: 0,
          manageResource: 0,
          manageMulti: 0,
          totalScore: 0,
        },
        originData: ''
      }
    },
    methods: {
      closeModal () {
        this.$modal.hide('loading-modal')
        this.$emit('close', true)
      },
      cancelEvaluation () {
        this.$emit('close', false)
      },
      addEvaluation () {
        if (this.reqData.totalScore == 0) {
          this.$toast.warning('인간적으로 0점은 주지 맙시다 -_-', {position: 'top'})
        } else {
          this.$modal.show('loading-modal')
          if (this.oldData == undefined) { //create
            this.reqData.targetUser = this.player._id
            this.reqData.writer = this.userDBIndex

            this.$lcordAPI.ability.create(this.reqData)
              .then(() => {
                this.closeModal()
              })
          } else { //update
            this.$lcordAPI.ability.delete(this.originData._id, this.originData.totalScore, this.player._id, this.abilityCount)
              .then(() => {
                this.$lcordAPI.ability.create(this.reqData)
                  .then(() => {
                    this.closeModal()
                  })
              })
          }
        }
      },
      delEvaluation () {
        this.$modal.show('dialog', {
          title: '평가 삭제',
          text: '해당 평가를 삭제하시겠습니까?',
          buttons: [
            {
              title: '취소',
              handler: () => {
                this.$modal.hide('dialog')
              }
            },
            {
              title: '확인',
              handler: () => {
                this.$modal.hide('dialog')
                this.$lcordAPI.ability.delete(this.originData._id, this.originData.totalScore, this.player._id, this.abilityCount)
                  .then(() => {
                    this.closeModal()
                  })
              }
            }
          ]
        })
      }
    },
    mounted() {
      if (this.oldData != undefined) {
        this.reqData = JSON.parse(JSON.stringify(this.oldData))
        this.originData = JSON.parse(JSON.stringify(this.oldData))
      }

    },
    computed: {
      ...mapGetters({
        userDBIndex: 'getUserDBIndex',
      }),
      chartOptionsStats: function () {
        let retObj = {
          title: {text: 'Total 능력치 : ' + this.reqDataTotal, align: 'center',},
          labels: ['빌드', '컨트롤', '판단', '자원 관리', '확장능력'],
          yaxis: {min: 0, max: 5, tickAmount: 5},
          chart: {toolbar: {show: false}},
          theme: {palette: 'palette7'} // upto palette10
        }
        return retObj
      },
      chartSeriesStats: function () {
        let retObj = [{ name: "",
          data: [this.reqData.build, this.reqData.control, this.reqData.judgement, this.reqData.manageResource, this.reqData.manageMulti]
        }]

        return retObj
      },

      reqDataTotal: function () {
        this.reqData.totalScore = ((this.reqData.build + this.reqData.control + this.reqData.judgement + this.reqData.manageResource + this.reqData.manageMulti) / 5).toFixed(2)
        return this.reqData.totalScore
      }
    }
  }
</script>

<style scoped>
  .contents-container { height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }
  .input-area { display: flex; flex-direction: row; justify-content: center; align-items: center; margin: 20px;}
  .slider-container { display: flex; flex-direction: column; justify-content: center; align-items: center; }
  .slider-container > div { display: flex; flex-direction: row; justify-content: center; align-items: center; }
  .label-ability { width: 80px; margin: 15px; text-align: center; }
  .footer { width: 100%; display: flex; flex-direction: row; justify-content: space-around; align-items: center;}
  button { width: 200px; }
</style>
