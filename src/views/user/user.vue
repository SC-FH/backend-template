<template>
    <div class="user">
        <div class="searchBox">
            <el-input style="width: 220px;" v-model="searchCfg.name" placeholder="请输入昵称" clearable></el-input>
            <el-select style="width: 220px;" v-model="searchCfg.role" placeholder="角色" clearable>
                <el-option label="超级管理员" value="admin"></el-option>
                <el-option label="普通用户" value="user"></el-option>
            </el-select>
            <el-button type="primary" @click="getUserList(true)">查询</el-button>
        </div>
        <el-table style="flex: 1 0;" :data="tableData">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="name" label="昵称" align="center" />
            <el-table-column prop="role" label="角色" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="updateTime" label="更新时间" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageCfg.currentPage" v-model:page-size="pageCfg.pageSize"
            :page-sizes="pageCfg.pagesSizes" layout="total, sizes, prev, pager, next, jumper" :total="pageCfg.total"
            @current-change="getUserList()" @size-change="getUserList(true)" />
    </div>
</template>
<script lang="ts" setup>
import { getUserListApi } from '@/api/user';
import { dayjs } from 'element-plus';
import { reactive, ref } from 'vue';


const tableData = ref([])
const searchCfg = reactive({
    name: "",
    role: ""
})
const pageCfg = reactive({
    currentPage: 1,
    pageSize: 10,
    pagesSizes: [10, 20, 50, 100],
    total: 0
})
function getUserList(resetPage = false) {
    if (resetPage) {
        pageCfg.currentPage = 1
    }
    getUserListApi({ page: pageCfg.currentPage, pageSize: pageCfg.pageSize, name: searchCfg.name, role: searchCfg.role }).then(res => {
        tableData.value = res.list
        pageCfg.total = res.total
    })
}
getUserList()
</script>
<style lang="scss" scoped>
.user {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .searchBox {
        display: flex;
        align-items: center;
        gap: 10px;
    }
}
</style>