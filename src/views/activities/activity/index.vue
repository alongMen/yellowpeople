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
        <template slot-scope="{ row }" slot="type" >
           <span v-if="row.type === 0">广告</span>
           <span v-if="row.type === 1">推广</span>
        </template>
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
          <Col :span="9">
            <FormItem label="奖励当日播放次数：" prop="playCountAddToday">
              <InputNumber v-model="form.playCountAddToday" ></InputNumber>

            </FormItem>
          </Col>
          <Col :span="14" v-show="type === 'add'">
            <FormItem label="任务类型" prop="type">
              <Select v-model="form.type">
                <Option v-for="item in activityType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
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
  get_activity_list_page,
  add_activity_data_list,
  update_activity_data_list,
  delete_activity_data_list
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
      activityType: [
        {value: 0, label:'广告'},
        {value: 1, label:'推广'}
      ],
      title_header: '',
      columns:[
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '当日播放次数(奖励)',
          key: 'playCountAddToday',
          align: 'center'
        },
        {
          title: '任务类型',
          slot: 'type',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{
        playCountAddToday: [{ required: true, message: '请填写奖励当日播放次数', type:'number',trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型',type:'number',trigger: 'change' }],
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
      this.title_header = '活动添加：';
      this.form = {
        playCountAddToday: 0,
        playCountAddPerDay: 0,
      };
    },
    async edit(row){
      this.showModal = true;
      this.form = row;
      this.type = 'edit';
      this.title_header = '活动编辑：';
    },
    del(id){
      this.isDel = true;
      this.delID = id;
    },
    async delOK() {
      this.btnLoading = true;
      const res = await delete_activity_data_list(this.delID);
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
        const res = await add_activity_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加活动成功！');
          this.$Modal.remove();
        }
      }else if(this.type === 'edit'){
        const res = await update_activity_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改活动成功！');
          this.$Modal.remove();
        }
      }
      
    },
    async getData() {
      this.loading = true;
      const res = await get_activity_list_page();
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