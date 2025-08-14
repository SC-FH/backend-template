<template>
    <div class="box">
        <img class="img" src="@/assets/imgs/404/404.png" alt="">
        <div class="note">哎呀，没有找到页面哦！</div>
    </div>
</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.box {
    height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .img {
        width: 800px;
        height: 800px;
    }

    .note {
        position: relative;
        color: #cecbeb;
        bottom: 200px;
    }
}
</style>