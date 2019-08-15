
<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />

    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="xinimg">
          <img :src="row.xinimg" :onerror="defaultImg" width='50' height='50' v-if='row.xinimg'></img>
        </template>
        <template slot-scope="{ row }" slot="recommend">
          <i-switch
            v-model="row.recommend"
            size="large"
            @on-change="value => setRecommend(value, row)"
            :loading="btnLoading"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </template>
       <template slot-scope="{ row,index }" slot="status">
         <i-switch
            v-model="row.status"
            size="large"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="action" >
           <Button type="success" @click='anchorConfig(row)' :loading="btnLoading">主播管理</Button>&nbsp;
        </template>
      </Table>
      <div class="pagination">
        <Page
          :total="total"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
          show-total
        />
      </div>
    </div>

    <Drawer :title="title" v-model="showModal" width="70" >
        <anchor-config :form='form' v-if='showModal' ref='form'/>
    </Drawer>

  </div>
</template>




<script>
import { 
  get_Platform_list_page,
  set_Platform_Recommend_state,
  set_Platform_status_state,
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin';
import { cloneDeep } from "lodash"
import AnchorConfig from './components/anchor-config';
export default {
  name: "live-config",
  mixins: [mixin],
  components:{
    AnchorConfig
  },
  data(){
    return{
      title: '',
      form: {},
      type:'',
      showModal: false,
      columns:[
        {
          title: '平台名称',
          key: 'title'
        },
        {
          title: '平台logo',
          slot: 'xinimg'
        },
        {
          title: '是否推荐',
          slot: 'recommend'
        },
        {
          title: '平台状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{}
    }
  },
  computed:{
    defaultImg(){
      return 'this.src="'+require('@/assets/default.jpg')+'"'
    },
    defaultForm(){
      return [
        {
          label: '平台名称',
          type: 'text',
          field: 'title'
        },
        {
          type: 'radioButton',
          label: '平台状态',
          options: [
            {label:'正常',value:'true'},
            {label:'关闭',value:'false'},
          ],
          field: 'status'
        },
        {
          type: 'radioButton',
          label: '是否开启推荐',
          options: [
            {label:'是',value:'true'},
            {label:'否',value:'false'},
          ],
          field: 'isRecommend'
        },
        
      ]
    },
    moreForm(){
      return []
    }
  },
  methods:{
    anchorConfig(row){
      this.showModal = true;
      this.form = cloneDeep(row);
    },
    async setRecommend(value,row,index){
      let state
      let title
      if(value == true){
        state = true
        title = '开启推荐'
      }else{
        state = false
         title = '关闭推荐'
      }
      this.$Modal.confirm({
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_Platform_Recommend_state(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}成功`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value == true) {
              row.isRecommend = false;
            } else {
              row.isRecommend = true;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value == true) {
            row.isRecommend = false;
          } else {
            row.isRecommend = true;
          }
          this.data.splice(index,1,row);
        }
      });
    },
    async setState(value,row,index){
      let state
      let title
      if(value == true){
        state = true
        title = '开启'
      }else{
        state = false
         title = '关闭'
      }
      this.$Modal.confirm({
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该平台</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_Platform_status_state(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}平台成功`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value == true) {
              row.status = false;
            } else {
              row.status = true;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value == true) {
            row.status = false;
          } else {
            row.status = true;
          }
          this.data.splice(index,1,row);
        }
      });
    },
    async getData() {
      this.loading = true;
      const res = await get_Platform_list_page(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.data.itemTotal;
        this.data = res.data.data.itemList;
      }
    },
  },
  mounted() {},
}
</script>
<style lang="less" scoped>
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
</style>