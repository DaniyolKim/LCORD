<template>
  <div class="size-modal-content">
    <div>{{title}}</div>
    <table>
      <thead>
      <tr>
        <th>순서</th><th>맵</th><th>{{match.home}}</th><th>{{match.away}}</th><th>승리</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!isEdit" v-for="record in recordList">
        <td>{{record.order}}</td><td>{{record.map}}</td>
        <td><label v-for="m in record.home">{{m.name}} </label></td><td><label v-for="m in record.away">{{m.name}} </label></td>
        <td>{{record.winner}}</td>
      </tr>
      <tr v-if="isEdit" v-for="record in recordList">
        <td><select v-model="record.order"><option v-for="(order, index) in orderList">{{index+1}}</option></select></td>
        <td><select v-model="record.map"><option v-for="map in mapList">{{map}}</option></select></td>
        <td><label v-for="m in record.home">
          <select v-model="m.name"><option v-for="user in membersHome">{{user.name}}</option></select></label></td>
        <td><label v-for="m in record.away">
          <select v-model="m.name"><option v-for="user in membersHome">{{user.name}}</option></select></label></td>
        <td>
          <select v-model="record.winner"><option v-for="team in teamList">{{team.name}}</option></select>
        </td>
      </tr>
      </tbody>
    </table>
    <div  v-if="isEdit">
      <button @click="closeModal">취소</button>
      <button>저장</button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SizeModalTest',
    props: ['isEdit', 'title', 'match', 'membersAway', 'membersHome'],
    data () {
      return {
        orderList: [1, 2, 3, 4, 5, 6, 7],
        mapList: ['투혼', '서킷브레이커', '블록체인SE', '글라디에이터', '파워 본드', '오버워치', '트레스패스', '헌터', '빠른무한'],
        teamList: [ {name: '1팀'}, {name: '2팀'},],
        recordList: [
          { time: '2019-10-10 PM 10', order: '1', map: '투혼', winner: '', home: [{name:'A'}], away: [{name:'B'}], winner: '1팀' },
          { time: '2019-10-10 PM 10', order: '2', map: '서킷브레이커', winner: '', home: [{name:'B'}], away: [{name:'C'}], winner: '1팀' },
          { time: '2019-10-10 PM 10', order: '3', map: '헌터', winner: '', home: [{name:'C'}, {name:'D'}, {name:'E'}], away: [{name:'C'}, {name:'D'}, {name:'E'}], winner: '1팀' },
          { time: '2019-10-10 PM 10', order: '4', map: '블록체인SE', winner: '', home: [{name:'C'}], away: [{name:'D'}], winner: '2팀' },
          { time: '2019-10-10 PM 10', order: '5', map: '글라디에이터', winner: '', home: [{name:'D'}], away: [{name:'E'}], winner: '2팀' },
          { time: '2019-10-10 PM 10', order: '6', map: '빠른무한', winner: '', home: [{name:'C'}, {name:'D'}, {name:'E'}], away: [{name:'C'}, {name:'D'}, {name:'E'}], winner: '1팀' },
          { time: '2019-10-10 PM 10', order: '7', map: '오버워치', winner: '', home: [{name:'F'}], away: [{name:'G'}], winner: '2팀' },
        ]
      }
    },
    methods: {
      closeModal () {
        this.$emit('close')
      }
    }
  }
</script>
<style>
  .size-modal-content {
    padding: 10px;
    overflow: auto;
  }
</style>
