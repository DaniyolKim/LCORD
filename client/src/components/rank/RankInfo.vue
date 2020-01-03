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
  th.active { color: crimson; text-shadow: 0 0 1px #fff; }
  th.active .arrow { opacity: 1; }

  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }

  .arrow.dsc {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid crimson;
  }

  .arrow.asc {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid crimson;
  }
</style>
