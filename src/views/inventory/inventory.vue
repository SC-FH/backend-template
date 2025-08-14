<template>
    <div class="inventory">
        <div class="searchBox">
            <el-input style="width: 220px;" placeholder="请输入商品名称" clearable></el-input>
            <el-select style="width: 220px;" placeholder="商品分类"></el-select>
            <el-button type="primary">查询</el-button>
        </div>
        <el-table style="flex: 1 0;" :data="tableData">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="date" label="商品名称" align="center" />
            <el-table-column prop="date" label="商品分类" align="center" />
            <el-table-column prop="name" label="单价" align="center" />
            <el-table-column prop="name" label="库存数" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageCfg.currentPage" v-model:page-size="pageCfg.pageSize"
            :page-sizes="pageCfg.pagesSizes" layout="total, sizes, prev, pager, next, jumper" :total="pageCfg.total" />
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';

const tableData = ref([])

const pageCfg = reactive({
    currentPage: 1,
    pageSize: 10,
    pagesSizes: [10, 20, 50, 100],
    total: 0
})
</script>
<style lang="scss" scoped>
.inventory {
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