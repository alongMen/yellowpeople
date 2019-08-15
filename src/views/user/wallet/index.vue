<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="[]"
      v-model="query"
    />
    <div class="totalbox">
      <Row>
        <Col span="8"><span class="titleitem">平台总余额：</span>{{totals.amount}}</Col>
        <Col span="8"><span class="titleitem">平台累计充值量：</span>{{totals.totalAmount}}</Col>
        <Col span="8"><span class="titleitem">待提取佣金量：</span>{{totals.totalBrokerage}}</Col>
    </Row>
    </div>
    <div class="table-area">
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

        <template slot-scope="{ row }" slot="action" >
           <Button type="success" @click='edit1(row)' :loading="btnLoading">编辑金额</Button>&nbsp;
           <Button type="success" @click='edit2(row)' :loading="btnLoading">编辑积分</Button>&nbsp;
        </template>
      </Table>
    </div>

    <div class="pagination">
        <Page
          :total="total"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
          show-total
        />
      </div>
      
    <Modal title="编辑" v-model="isEdit" :mask-closable="false">
        <Form ref="formpassword" :model="form" :rules="rules" :label-width="150">
          <FormItem label="红包金额：" prop="amount" v-if="type == 1">
            <InputNumber v-model="form.amount"  clearable style="width: 200px" />
          </FormItem>
          <FormItem label="积分：" prop="integral" v-if="type == 2">
            <InputNumber v-model="form.integral" style="width: 200px" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="isEdit = false">取消</Button>
          <Button type="primary" :loading="btnLoading" @click="editOK">确定</Button
          >
        </div>
      </Modal>

  </div>
</template>




<script>
import {
  get_wallet_list,
  edit_wallet_amount,
  edit_wallet_integral,
  get_amount_total
} from '@/service/index';
// import uploadButton from "@/components/upload-button/index";
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "wallet",
  mixins: [mixin],
  // components:{
  //   uploadButton
  // },
  data(){
    return{
      totals:{},
      title: '',
      isEdit:false,
      form: {},
      type:1,
      title_header: '',
      columns:[
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '手机号码',
          key: 'phone'
        },
        {
          title: '余额',
          key: 'amount'
        },
        {
          title: '积分',
          key: 'integral'
        },
        {
          title: '佣金',
          key: 'brokerage'
        },
        {
          title: '充值总额',
          key: 'totalAmount'
        },
        {
          title: '总积分',
          key: 'totalImtegral'
        },
        {
          title: '操作',
          slot: 'action',
          width: 250
        },
      ],
      rules:{
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
      }
    }
  },
  computed:{
    defaultForm() {
      return [
        {
          type: 'text',
          label: '用户名',
          field: 'name'
        },
        {
          type: 'text',
          label: '手机号码',
          field: 'phone'
        },
      ]; 
    }
  },
  methods:{
    edit1(row){
      this.isEdit = true;
      this.form = row;
      this.type = 1;
    },
    edit2(row){
      this.isEdit = true;
      this.form = row;
      this.type = 2;
    },
    async editOK() {
      this.btnLoading = true;
      if(this.type == 1){
        const res = await edit_wallet_amount(this.form.id,this.form.amount);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.isEdit = false;
          this.$Message.success('修改成功！');
          this.$Modal.remove();
        }
      }else{
          const res = await edit_wallet_integral(this.form.id,this.form.integral);
          this.btnLoading = false;
          if (res.status == 200) {
            this.getData();
            this.isEdit = false;
            this.$Message.success('修改成功！');
            this.$Modal.remove();
          }
      }

      
    },
    async getData() {
      const res = await get_wallet_list(this.page,this.limit,this.query);
      // console.log(res);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data.itemList;
        this.total = res.data.itemTotal;
      }
    },
    async getTotal(){
      const res = await get_amount_total();
      if(res.status<400){
        this.totals = res.data;
      }
    }
  },
  mounted() {
    this.getTotal();
  }
}
</script>
<style lang="less">
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
  .totalbox{
    padding: 10px 20px;
    text-align: center;
    color: #ae00ff;
    border: 1px solid #ccc;
    width: 80%;
    margin: 0 auto;
    border-radius: 6px;
    .titleitem{
      color: #000;
    }
  }
</style>