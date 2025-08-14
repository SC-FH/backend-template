<template>
    <div class="permission">
        <div class="searchBox">
            <el-input style="width: 220px;" placeholder="请输入权限名称" clearable></el-input>
            <el-button type="primary">查询</el-button>
        </div>
        <el-table style="flex: 1 0;" :data="tableData">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="updateTime" label="更新时间" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteItem">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageCfg.currentPage" v-model:page-size="pageCfg.pageSize"
            :page-sizes="pageCfg.pagesSizes" layout="total, sizes, prev, pager, next, jumper" :total="pageCfg.total" />
    </div>
</template>
<script lang="ts" setup>
import { dayjs, ElMessage, ElMessageBox } from 'element-plus';
import { reactive, ref } from 'vue';

const tableData = ref([{
    name: "创建用户",
    createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
}])

const pageCfg = reactive({
    currentPage: 1,
    pageSize: 10,
    pagesSizes: [10, 20, 50, 100],
    total: 1
})

function deleteItem(index: number) {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        tableData.value.splice(index, 1)
        ElMessage.success('删除成功')
    }).catch(() => { })
}

</script>
<style lang="scss" scoped>
.permission {
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