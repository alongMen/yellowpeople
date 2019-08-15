<template>
  <div class="main-area">
      <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />

    <div class="tils">
      <p>代理佣金计算方法：</p>
      <p class="tilsitem">上级佣金 &nbsp;&nbsp;&nbsp;&nbsp; = &nbsp;&nbsp;上级提成百分比*用户充值金额;</p>
      <p class="tilsitem">上二级佣金 &nbsp;&nbsp;= （上级成现百分比*用户充值金额）*上二级提成百分比.</p>
    </div>

    <div class="table-area">
      <div>
        <Button type="info" @click="add">添加</Button>
      </div><br>
      <Table :columns="columns" :data="data" :loading="loading">

        <template slot-scope="{ row,index }" slot="action" >
           <Button type="success" @click='edit(row,index)' :loading="btnLoading">编辑</Button>&nbsp;
           <Button type="error" @click='del(row,index)' :loading="btnLoading">删除</Button>
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

    <Drawer
      :title="title"
      v-model="showModal"
      width="70"
    >
      <div class="title_header">{{title_header}}</div>
      <Form :label-width="140" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20" v-if="form.name !== '默认等级'">
          <Col :span="12" >
            <FormItem label="代理等级名称：" prop="name">
              <Input  v-model="form.name"></Input>
            </FormItem>
          </Col>
        </Row>
         <Row :gutter="20" v-if="form.name !== '默认等级'">
          <Col :span="5" >
            <FormItem label="满足充值金额：" prop="location">
              <Input  v-model="form.amount"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20" v-if="form.name !== '默认等级'">
          <Col :span="12">
            <FormItem label="推广人数：" prop="amount">
              <InputNumber v-model="form.promotion" size="small" :min='0'></InputNumber>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="提成佣金百分比：" prop="integration">
              <InputNumber v-model="form.percent"  :min='0' size="small"></InputNumber>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="最小提现金额：" prop="amount">
              <InputNumber v-model="form.miniAmount" size="small" :min='0'></InputNumber>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="最大提现金额：" prop="integration">
              <InputNumber v-model="form.maxAmount"  :min='0' size="small"></InputNumber>
            </FormItem>
          </Col>
        </Row>
 
        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="showModal = false">取消</Button>
          <Button type="primary" @click="handleVideoOK" :loading="btnLoading">确定</Button>
        </div>
      </Form>
    </Drawer>

    <Modal
        v-model="modal6"
        title="提示："
        @on-ok="delOK">
        <p>确定删除？</p>
    </Modal>
  </div>
</template>




<script>
import {
  get_agent_list,
  add_agent_list,
  edit_agent_list,
  del_agent_list,
  state_agent_list,
} from '@/service/index';
import { adLocationType } from '@/config/enum';
// import uploadButton from "@/components/upload-button/index";
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "ad-info",
  mixins: [mixin],
  // components:{
  //   uploadButton
  // },
  data(){
    return{
      title: '',
      modal6: false,
      adLocationType,
      showModal: false,
      isDel: false,
      delID: 0,
      form: {},
      type:'',
      title_header: '',
      columns:[
        {
          title: '代理等级名称',
          key: 'name'
        },
        {
          title: '满足充值金额',
          key: 'amount'
        },
        {
          title: '推广人数',
          key: 'promotion'
        },
        {
          title: '最小提现金额',
          key: 'miniAmount'
        },
        {
          title: '最大提现金额',
          key: 'maxAmount'
        },
        {
          title: '提成佣金百分比',
          key: 'percent'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    defaultForm() {
      return [
        {
          type: 'text',
          label: '等级名称',
          field: 'name'
        },
      ];
    },
    moreForm() {
      return []
    }
  },
  methods:{
    del(row,index){
      this.form = row;
      this.delID = index;
      this.modal6 = true;
    },
    async delOK(){
      const res = await del_agent_list(this.form.id);
      if(res.status < 400){
        this.modal6 = false;
        this.data.splice(this.delID,1);
        this.$Message.success('删除成功！')
      }
    },
    add(){
      this.showModal = true;
      this.type = 'add';
      this.title_header = '添加：';
      this.form = {
        promotion:0,
        miniAmount:0,
        maxAmount:0,
        percent: 0
      };
    },
    async edit(row){
      this.showModal = true;
      this.form = row;
      this.type = 'edit';
      this.title_header = '编辑：';
    },
    async handleVideoOK() {
      this.btnLoading = true;
      if(this.type === 'add'){
        // console.log(this.form);
        const res = await add_agent_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加成功！');
          this.$Modal.remove();
        }
      }else if(this.type === 'edit'){
        delete this.form.location;
        const res = await edit_agent_list(this.form.id,this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改成功！');
          this.$Modal.remove();
        }
      }
      
    },
    async getData() {
      this.loading = true;
      const res = await get_agent_list(this.page,this.limit,this.query);
      // console.log(res);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data.itemList;
        this.total = res.data.itemTotal;
      }
    },
  },
  mounted() {},
}
</script>
<style lang="less">
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
  .tils{
    padding-left: 20px;
    p:first-child{
      font-weight: 700;
    }
    .tilsitem{padding-left: 20px;line-height: 20px;color: #ae00ff;opacity: 0.6;}
  }
</style>