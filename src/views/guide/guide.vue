<template>
    <div class="guide">
        <div class="card">
            <div class="title">项目地址：</div>
            <a href="https://gitee.com/vanish_FH/backend-template"
                target="_blank">https://gitee.com/vanish_FH/backend-template</a>
        </div>
        <div class="card">
            <div class="title">技术栈：</div>
            <span>vue3 + ts + element plus</span>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss" scoped>
.guide {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .card {
        background-color: var(--box-bg-color);
        border-radius: 4px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 10px;

        .title {}
    }
}
</style>