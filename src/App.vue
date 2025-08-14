<template>
    <router-view></router-view>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getSelfInfoApi } from './api/user';
import useStore from './store';

const store = useStore();
const router = useRouter();
store.changeTheme(store.isDarkTheme)
store.changePrimaryColor()

if (store.token) {
    getSelfInfoApi().then(res => {
        store.setStorageState("userInfo", res)
    })
} else {
    router.push("/login")
}
</script>