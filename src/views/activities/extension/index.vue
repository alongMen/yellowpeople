<template>
  <div class="main-area">
    <!-- <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    /> -->

    <div class="table-area">
      <div>
        <Button type="info" @click="add">添加</Button>
      </div><br>
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row,index }" slot="action" >
           <Button type="success" @click='edit(row,index)' :loading="btnLoading">编辑</Button>&nbsp;
           <Button type="error" @click='del(row.id)' :loading="btnLoading">删除</Button>
        </template>
      </Table>
      <!-- <div class="pagination">
        <Page
          :total="total"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
          show-total
        />
      </div> -->
    </div>

    <Modal
      v-model="showModal"
      :title="title"
      :loading="btnLoading"
      @on-ok="handleVideoOK">
      <div class="title_header">{{title_header}}</div>
      <Form :label-width="140" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="推广人数：" prop="promoteCount">
              <InputNumber v-model="form.promoteCount" ></InputNumber>
            </FormItem>
          </Col>
          <Col :span="10">
            <FormItem label="奖励每日播放次数：" prop="playCountAddPerDay">
              <InputNumber v-model="form.playCountAddPerDay" ></InputNumber>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
        v-model="isDel"
        title="提示："
        :loading="btnLoading"
        @on-ok="delOK">
        <p>是否删除？</p>
    </Modal>
  </div>
</template>




<script>
import { 
  get_PromoteAchievement_list_page,
  add_PromoteAchievement_data_list,
  update_PromoteAchievement_data_list,
  delete_PromoteAchievement_data_list
} from '@/service/index';
import { adLocationType } from '@/config/enum';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "ad-info",
  mixins: [mixin],
  data(){
    return{
      title: '',
      adLocationType,
      showModal: false,
      isDel: false,
      delID: 0,
      form: {},
      type:'',
      title_header: '',
      columns:[
{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '推广人数',
          key: 'promoteCount',
          align: 'center'
        },
        {
          title: '每日播放次数(奖励)',
          key: 'playCountAddPerDay',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{
        playCountAddPerDay: [{ required: true, message: '请填写公奖励每日播放次数',type:'number', trigger: 'blur' }],
        promoteCount: [{ required: true, message: '请填写推广人数',type:'number',trigger: 'blur' }],
      }
    }
  },
  computed:{
    defaultForm(){
      return []
    },
    moreForm(){
      return []
    }
  },
  methods:{
    add(){
      this.showModal = true;
      this.type = 'add';
      this.title_header = '任务添加：';
      this.form = {
        promoteCount: 0,
        playCountAddToday: 0,
        playCountAddPerDay: 0,
        order: 0
      };
    },
    async edit(row){
      this.showModal = true;
      this.form = row;
      this.type = 'edit';
      this.title_header = '任务编辑：';
    },
    del(id){
      this.isDel = true;
      this.delID = id;
    },
    async delOK() {
      this.btnLoading = true;
      const res = await delete_PromoteAchievement_data_list(this.delID);
      this.btnLoading = false;
      if (res.status == 200) {
        this.isDel = false;
        this.$Message.success('删除成功！');
        this.$Modal.remove();
        this.getData();
      }
    },
    async handleVideoOK() {
      this.btnLoading = true;
      if(this.type === 'add'){
        const res = await add_PromoteAchievement_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加任务成功！');
          this.$Modal.remove();
        }
      }else if(this.type === 'edit'){
        const res = await update_PromoteAchievement_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改广告成功！');
          this.$Modal.remove();
        }
      }
      
    },
    async getData() {
      this.loading = true;
      const res = await get_PromoteAchievement_list_page();
      this.loading = false;
      if (res.status < 400) {
        // console.log(res)
        // this.total = res.data.count;
        this.data = res.data;
      }
    },
  },
  mounted() {
    this.getData();
  },
}
</script>
<style lang="less">
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
</style>