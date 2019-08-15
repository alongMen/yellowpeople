<template>
    <div>
        <Row>
            <Col span="24">
                <span class="expand-key">图片标签: </span>
                <span class="expand-value">{{ typeMarksList }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="20">
                <span class="expand-key">图片: </span>
                <ol style="width:100%;display:flex;flex-wrap: wrap;margin-left:50px;">
                    <li style="width: 5%;margin-top:20px;margin-left:10px;" class="expand-value" v-for="(item,index) in row.pictureLinks" :key="index">
                        <img :src="item" width="40" height="40" alt="">
                    </li>
                </ol>
            </Col>
        </Row>
    </div>
</template>

<script>
import { 
  get_Picture_type_list
} from '@/service/index';
  export default {
    props: {
        row: Object
    },
    data(){
        return{
            typeMarkList:[],
            TypeMarkList:[],
            typeMarks:[]
        }
    },
    methods:{
        async getTypeMarkList(){
            this.loading = true;
            const res = await get_Picture_type_list(this.query);
            this.loading = false;
            if (res.status < 400) {
                // console.log(res.data);
                this.typeMarkList = res.data;
                this.typeMarkList.map(item=>{
                this.TypeMarkList.push({label:item.name,value:item.id})
                });
                this.TypeMarkList.forEach((items)=>{
                        this.row.typeMark.forEach(item=>{
                            if(item == items.value){
                                this.typeMarks.push(items.label);
                            }
                        })
                    }
                )
                // console.log(this.typeMarks)
            }else{
                this.$Message.success('图片标签获取错误！');
            }
        }
    },
    computed:{
        typeMarksList(){
            return this.typeMarks.join('、');
        }
    },
    mounted() {
        this.getTypeMarkList();
    },
  };
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>