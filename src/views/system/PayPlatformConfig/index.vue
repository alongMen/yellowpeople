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
      <div>
        <Button type="info" @click="add">添加</Button>
      </div><br>
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row,index }" slot="status">
         <i-switch
            v-model="row.status"
            size="large"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
          >
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot-scope="{ row,index }" slot="action" >
           <Button type="success" @click='edit(row,index)' :loading="btnLoading">编辑</Button>&nbsp;
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
      <Form :label-width="150" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20">
          <Col :span="10" >
            <FormItem label="平台名称：" prop="name">
              <Input  v-model="form.name"></Input>
            </FormItem>
          </Col>
          <Col :span="10" >
            <FormItem label="商户ID：" prop="merchId">
              <Input  v-model="form.merchId"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="10" >
            <FormItem label="接口密钥：" prop="apiSecret">
              <Input  v-model="form.apiSecret"></Input>
            </FormItem>
          </Col>
          <Col :span="10" >
            <FormItem label="支付接口地址：" prop="payUrl">
              <Input  v-model="form.payUrl"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="10" >
            <FormItem label="支付成功后返回地址：" prop="back_Url">
              <Input  v-model="form.back_Url"></Input>
            </FormItem>
          </Col>
          <Col :span="10" >
            <FormItem label="订单确认地址：" prop="confirmUrl">
              <Input  v-model="form.confirmUrl"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="18" >
            <FormItem label="支付成功后回调地址：" prop="call_Url">
              <Input v-model="form.call_Url" />
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="20" >
            <FormItem label="支付类型：" prop="payType">
              <Button type="primary" @click="addtype" >增加</Button><br>
               <Table border :columns="columns1" :data="typelist">
                  <template slot-scope="{ row }" slot="name">
                      <strong>{{ row.name }}</strong>
                  </template>
                  <template slot-scope="{ row, index }" slot="action">
                      <Button type="primary" size="small" style="margin-right: 5px" @click="edittype(row)">编辑</Button>
                      <Button type="error" size="small" @click="removetype(index)">删除</Button>
                  </template>
              </Table>
            </FormItem>
          </Col>
        </Row>

        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="cancelEdit">取消</Button>
          <Button type="primary" @click="addOK" :loading="btnLoading">确定</Button>
        </div>
      </Form>
    </Drawer>

    <Modal title="支付方式" v-model="isSHOW" :mask-closable="false">
      <Form ref="formpassword" :model="form1" :rules="rules" :label-width="150">
        <FormItem label="支付方式：" prop="payname">
          <Input v-model="form1.payname"/>
        </FormItem>
        <FormItem label="支付字段值：" prop="payway">
          <Input v-model="form1.payway"  />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isSHOW = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="typeOK">确定</Button
        >
      </div>
    </Modal>
  </div>
</template>




<script>
import { 
  state_PayPlatformConfig,
  get_PayPlatformConfig,
  edit_PayPlatformConfig,
  add_PayPlatformConfig
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "notice-setting",
  mixins: [mixin],
  data(){
    return{
      title: '',
      showModal: false,
      isSHOW:false,
      delID: 0,
      form: {},
      form1:{},
      typelist:[],
      type:'',
      title_header: '',
      types:0,
      columns:[
        {
          title: '平台名称',
          key: 'name'
        },
        {
          title: '商户ID',
          key: 'merchId'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      columns1:[
        {
          title: '支付方式',
          key: 'payname'
        },
        {
          title: '支付字段',
          key: 'payway'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{
        name: [
          { required: true, message: '平台名称', trigger: 'blur' }
        ],
      }
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '平台名称',
          type: 'text',
          field: 'name'
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
      ]
    },
    moreForm(){
      return []
    }
  },
  methods:{
    addtype(){
      this.isSHOW = true;
      this.form1={};
      this.types = 0;
      
    },
    typeOK(){
        if(this.types == 0){
          this.typelist.push(this.form1);
        }
        this.isSHOW = false;
    },
    edittype(row){
      this.isSHOW = true;
      this.form1 = row;
      this.types = 1;
    },
    removetype(index){
      this.typelist.splice(index,1)
    },
    async setState(value,row,index){
      let state
      let title
      if(value == true){
        state = true
        title = '启用'
      }else{
        state = false
         title = '禁用'
      }
      this.$Modal.confirm({
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}该平台</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await state_PayPlatformConfig(row.id, state);
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
    add(){
      this.showModal = true;
      this.type = 'add';
      this.title_header = '添加：';
      this.form = {};
    },
    async edit(row){
      this.showModal = true;
      this.form = row;
      this.typelist = [];
      if(this.form.payType){
        let types = this.form.payType;
        for (let key in types){
            this.typelist.push({
                payname: key,
                payway: types[key]
            })
        }
        // console.log(this.typelist)
      }
      this.type = 'edit';
      this.title_header = '编辑：';
    },
    cancelEdit(){
      this.showModal = false;
      this.$Modal.remove();
      this.form1 = {};
      this.$refs.form.resetFields();
    },
    async addOK() {
      this.btnLoading = true;
      this.form.payType = {};
      this.typelist.forEach((item,index) => {
        this.form.payType[item.payname] = item.payway
      });
      // console.log(this.form)
      if(this.type === 'add'){
        const res = await add_PayPlatformConfig(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加成功！');
          this.$Modal.remove();
        }else{
          this.$Message.success(res.title);
        }
      }else if(this.type === 'edit'){
        const res = await edit_PayPlatformConfig(this.form.id,this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改成功！');
          this.$Modal.remove();
        }else{
          this.$Message.success(res.title);
        }
      }
      
    },
    async getData() {
      const res = await get_PayPlatformConfig(this.query);
      if (res.status < 400) {
        this.data = res.data.list;
      }
    },
  },
  mounted() {},
}
</script>
<style lang="less">
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
</style>