<template>
  <div>{{$defs.battleTypeList[type].name}} 배틀 순위 페이지</div>
</template>

<script>
  export default {
    name: "RankInfo",
    props: ['type']
  }
</script>

<style scoped>

</style>
