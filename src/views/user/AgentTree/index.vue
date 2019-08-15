<template>
    <div class="agentTree">
        <tree-grid 
            :items='data' 
            :columns='columns'
            @on-row-click='rowClick'
            @on-selection-change='selectionClick'
            @on-sort-change='sortClick'
        ></tree-grid>
    </div>
</template>
<script>
import TreeGrid from './components/treeGrid'
import {
  get_agent_tree
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
    components: {
        TreeGrid
    },
    mixins: [mixin],
    data(){
        return{
            columns: [
                {
                    type: 'selection',
                    width: '50',
                }, 
                {
                    title: '用户名',
                    key: 'name',
                    width: '500',
                }, 
                {
                    title: '电话',
                    key: 'phone',
                    width: '150',
                },
                {
                    title: '等级',
                    key: 'gradeName',
                    width: '100',
                }, 
                {
                    title: '充值总金额',
                    key: 'totalAmount',
                    width: '80',
                }, 
                {
                    title: '佣金额度',
                    key: 'brokerage',
                    width: '80',
                }, 
                {
                    title: '下一级代理数量',
                    key: 'childrenCount',
                    width: '80',
                }, 
                // {
                //     title: '操作',
                //     type: 'action',
                //     actions: [{
                //         type: 'primary',
                //         text: '编辑'
                //     }, {
                //         type: 'error',
                //         text: '删除'
                //     }],
                //     width: '150',
                // }
            ],
            data: []
        }
    },
    methods:{
        async getData(){
            const res = await get_agent_tree(0);
            if(res.status<400){
                this.data = res.data;
                // this.data = this.translateDataToTree(res.data)
                // console.log(this.data);
            }
        },
        rowClick(data, index, event) {
            // console.log('当前行数据:' + data)
            // console.log('点击行号:' + index)
            // console.log('点击事件:' + event)
        },
        selectionClick(arr) {
            // console.log('选中数据id数组:' + arr)
        },
        sortClick(key, type) {
            // console.log('排序字段:' + key)
            // console.log('排序规则:' + type)
        },
        //树形结构数组转换成父子结构树
        // translateDataToTree(data) {
        //     let parents = data
        //     // .filter(value => value.parentId == 'undefined' || value.parentId == null)
        //     let children = data.filter(value => value.parentId !== 'undefined' && value.parentId != null)
        //     let translator = (parents, children) => {
        //         parents.forEach((parent) => {
        //         children.forEach((current, index) => {
        //             if (current.parentId === parent.id) {
        //             let temp = JSON.parse(JSON.stringify(children))
        //             temp.splice(index, 1)
        //             translator([current], temp)
        //             typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        //             }
        //         }
        //         )
        //         }
        //         )
        //     };
            
        //     translator(parents, children)
        //     // console.log(parents);
        //     return parents
        // }
    }
}
</script>
<style>
    .agentTree{padding-right: 30px;}
</style>
