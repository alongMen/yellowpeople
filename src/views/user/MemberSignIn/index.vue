<template>
  <div class="main-area">
    <div class="table-area">
      <div>
        <Button type="info" @click="add">添加</Button>
      </div><br>
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot="signWeek" slot-scope="{ row }">
          <Tag color="cyan" v-for="(item,index) in week" :key="index" v-if="item.value == row.signWeek">{{item.label}}</Tag>
        </template>

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
    </div>

    <Drawer
      :title="title"
      v-model="showModal"
      width="70"
    >
      <div class="title_header">{{title_header}}</div>
      <Form :label-width="100" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20">
          <Col :span="12" >
            <FormItem label="名称：" prop="name">
              <Input  v-model="form.name"></Input>
            </FormItem>
          </Col>
        </Row>
         <Row :gutter="20">
          <Col :span="24" >
            <FormItem label="星期选择：" prop="location">
              <RadioGroup v-model="form.signWeek">
                  <Radio  :label="item.value"  v-for="(item,index) in week" :key="index"><span>{{item.label}}</span></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="红包金额：" prop="amount">
              <InputNumber v-model="form.amount" size="small" :min='0'></InputNumber>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="积分：" prop="integration">
              <InputNumber v-model="form.integration"  :min='0' size="small"></InputNumber>
            </FormItem>
          </Col>
        </Row>
 
        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="showModal = false">取消</Button>
          <Button type="primary" @click="handleVideoOK" :loading="btnLoading">确定</Button>
        </div>
      </Form>
    </Drawer>

  </div>
</template>




<script>
import {
  state_member_signIn,
  get_member_signIn,
  add_member_signIn,
  edit_member_signIn
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
      adLocationType,
      showModal: false,
      isDel: false,
      delID: 0,
      form: {},
      type:'',
      title_header: '',
      columns:[
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '星期',
          slot: 'signWeek'
        },
        {
          title: '红包金额',
          key: 'amount'
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
      week:[{label:'星期一',value:1},{label:'星期二',value:2},{label:'星期三',value:3},{label:'星期四',value:4},{label:'星期五',value:5},{label:'星期六',value:6},{label:'星期天',value:7}],
      rules:{
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
      }
    }
  },
  computed:{

  },
  methods:{
    add(){
      this.showModal = true;
      this.type = 'add';
      this.title_header = '添加：';
      this.form = {};
    },
    async edit(row){
      this.showModal = true;
      this.form = row;
      this.type = 'edit';
      this.title_header = '编辑：';
    },
    async setState(value, row, index) {
      let userStatus;
      let title;
      if (value) {
        userStatus = true;
        title = '启用';
      } else {
        userStatus = false;
        title = '禁用';
      }
      this.$Modal.confirm({
        title: `用户签到状态`,
        loading: true,
        content: `<p>是否${title}？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await state_member_signIn(row.id, userStatus);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`已${title}`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value) {
              row.status = false;
            } else {
              row.status = true;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value === 1) {
            row.status = 0;
          } else {
            row.status = 1;
          }
          this.data.splice(index,1,row);
        },
      });
    },
    async handleVideoOK() {
      this.btnLoading = true;
      if(this.type === 'add'){
        // console.log(this.form);
        const res = await add_member_signIn(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加成功！');
          this.$Modal.remove();
        }else{
          // console.log(res);
        }
      }else if(this.type === 'edit'){
        delete this.form.location;
        const res = await edit_member_signIn(this.form.id,this.form);
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
      const res = await get_member_signIn();
      console.log(res);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data;
      }
    },
  },
  mounted() {},
}
</script>
<style lang="less">
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
</style>