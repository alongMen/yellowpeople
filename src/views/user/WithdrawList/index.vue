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
        <template slot="createTime" slot-scope="{ row }">
          <span>{{formatBeijingDate(row.createTime)}}</span>
        </template>
        <template slot="passTime" slot-scope="{ row }">
          <span>{{formatBeijingDate(row.passTime)}}</span>
        </template>

        <template slot-scope="{ row,index }" slot="status">
          <Tag color="green"  v-if="row.status == 0">等待</Tag>
          <Tag color="cyan"   v-if="row.status == 1">通过</Tag>
          <Tag color="red"   v-if="row.status == -1">不通过</Tag>
        </template>

        <template slot-scope="{ row,index }" slot="withdrawAddress">
          <p>
            <!-- <span v-if="row.withdrawAddress.withdrawType == 1">微信</span>
            <span v-if="row.withdrawAddress.withdrawType == 2">支付宝</span>
            <span v-if="row.withdrawAddress.withdrawType == 3">银行卡</span><br> -->
            <span>{{row.withdrawAddress.address.name}}</span><br>
            <span>{{row.withdrawAddress.address.number}}</span>
          </p>
        </template>

        <template slot-scope="{ row }" slot="action" v-if="row.status != 1">
           <Button type="success" @click='Approve(row)' :loading="btnLoading">通过</Button>&nbsp;
           <Button type="error" @click='Deny(row)' :loading="btnLoading">拒绝</Button>&nbsp;
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

    <Modal
        v-model="modal1"
        title="提示："
        @on-ok="ok"
        @on-cancel="cancel">
          <Input v-model="msg" placeholder="拒绝理由"></Input>
    </Modal>
  </div>
</template>




<script>
import {
  get_WithdrawList,
  Approve_WithdrawList,
  Deny_WithdrawList
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "WithdrawList",
  mixins: [mixin],
  data(){
    return{
      id:0,
      modal1: false,
      msg:'',
      columns:[
        {
          title: '提现用户名',
          key: 'name'
        },
        {
          title: '提现金额',
          key: 'amount'
        },
        {
          title: '发起提现时间',
          slot: 'createTime',
          width:160
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '提现方式',
          slot: 'withdrawAddress',
          width:170
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '审核时间',
          slot: 'passTime',
          width:160
        },
        {
          title: '操作',
          slot: 'action',
        },
      ],
    }
  },
  computed: {
    defaultForm() {
      return [
        {
          type: 'text',
          label: '用户名',
          field: 'name'
        },
        {
          type: 'radioButton',
          label: '提现状态',
          options: [
            {label:'等待',value:'0'},
            {label:'通过',value:'1'},
            {label:'不通过',value:'-1'},
          ],
          field: 'Status'
        },
        {
          type: 'radioButton',
          label: '提现途径',
          options: [
            {label:'微信',value:'1'},
            {label:'支付宝',value:'2'},
            {label:'银行卡',value:'3'},
          ],
          field: 'WithdrawType'
        },
      ];
    },
    moreForm() {
      return []
    }
  },
  methods:{
    async ok(){
      this.loading = true;
      const res = await Deny_WithdrawList(this.id,this.msg);
      this.loading = false;
      if(res.status<400){
        this.$Message.info(res.data.errMsg);
        this.getData();
      }else{
        this.$Message.info(res.data.errMsg);
      }
    },
    cancel () {
      this.modal1 = false;
      this.msg = '';
    },
    async Approve(row){
      // console.log(row)
      this.loading = true;
      const res = await Approve_WithdrawList(row.id);
      this.loading = false;
      if(res.status<400){
        this.$Message.info(res.data.errMsg);
        this.getData();
      }else{
        this.$Message.info(res.data.errMsg);
      }

    },
    Deny(row){
      this.id = row.id;
      this.modal1 = true;
    },
    async getData() {
      const res = await get_WithdrawList(this.page,this.limit,this.query);
      // console.log(res);
      this.loading = false;
      if (res.status < 400) {
        this.data = res.data.itemList;
        this.total = res.data.itemTotal;
      }
    },
  },
  mounted() {

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