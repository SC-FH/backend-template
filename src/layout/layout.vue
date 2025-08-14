<template>
    <div class="layout">
        <sidebarLayout />
        <div class="main">
            <headerLayout />
            <pageTabs />
            <div class="body">
                <router-view v-slot="{ Component, route }">
                    <Transition name="layout-fade">
                        <KeepAlive :include="KeepAliveInclude">
                            <component :is="Component" />
                        </KeepAlive>
                    </Transition>
                </router-view>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import headerLayout from './headerLayout.vue'
import sidebarLayout from './sidebarLayout.vue'
import pageTabs from './pageTabs.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
const router = useRouter()
const KeepAliveInclude = computed(() => {
    return router.getRoutes().filter(v => v?.meta?.keepAlive).map(v => v.name) as any[]
})
</script>
<style lang="scss" scoped>
.layout-fade-enter-active,
.layout-fade-leave-active {
    transition: opacity 0.5s ease;
}

.layout-fade-enter-from,
.layout-fade-leave-to {
    position: absolute;
    opacity: 0;
}

.layout {
    --header-height: 60px;
    position: relative;
    display: flex;
    height: 100vh;
    overflow: hidden;

    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .body {
            flex: 1;
            padding: 20px;
            overflow: hidden;
        }
    }
}
</style>