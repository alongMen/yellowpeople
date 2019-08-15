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
      <!-- <div class="operation">
        <Button type="primary" style="width:100px;margin-left:-20px;" @click="add">添加</Button>
      </div><br> -->
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="createTime">
            {{formatBeijingDate(row.createTime)}}
        </template>
        <template slot-scope="{ row,index }" slot="status">
          <i-switch
            v-model="row.status"
            size="large"
            :true-value="1"
            :false-value="-1"
            @on-change="value => setState(value, row,index)"
            :loading="btnLoading"
          >
            <span slot="open">正常</span>
            <span slot="close">封停</span>
          </i-switch>
        </template>
        <!-- <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="changepwds(row)">修改密码</Button>
            <Button type="error" size="small" @click="changenum(row)">修改次数</Button>
        </template> -->
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

    <!-- <Modal title="修改密码" v-model="isChangePass" :mask-closable="false">
      <Form ref="formpassword" :model="form" :rules="rules" :label-width="150">
        <FormItem label="旧密码：" prop="oldPassword">
          <Input v-model="form.oldPassword" type="password" placeholder="旧密码" clearable style="width: 200px" />
        </FormItem>
        <FormItem label="新密码：" prop="newPassword">
          <Input v-model="form.newPassword" type="password" placeholder="新密码" clearable style="width: 200px" />
        </FormItem>
        <FormItem label="确认新密码：" prop="confirmPassword">
          <Input v-model="form.confirmPassword" type="password" placeholder="确认新密码" clearable style="width: 200px" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isChangePass = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="changepwdOK">确定</Button
        >
      </div>
    </Modal> -->
  
    <!-- 添加用户 -->
    <!-- <Drawer :title="title" v-model="showDraw" width="70" >
      <Form ref="form" :model="form" :rules="rules" label-position="top">
        <FormItem label="用户名" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input type="tel" v-model="form.phone"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input type="email" v-model="form.email"></Input>
        </FormItem>
        <FormItem label="密码" prop="passwordHash">
          <Input type="password" v-model="form.passwordHash"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirm">
          <Input type="password" v-model="form.confirm"></Input>
        </FormItem>
        
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px"  @click="showDraw = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="ok">确定</Button>
      </div>
    </Drawer> -->

    
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {memberType} from '@/config/enum'
import {
  get_users_list_page,
  set_state_users
} from '@/service/index';
import { validMobileNoRequired,validEmailRequired } from '@/utils/validate'
export default {
  name: 'user-list',
  mixins: [mixin],
  data() {
    const validRepassword = (rule, value, cb) => {
      if (this.form.passwordHash && value !== this.form.passwordHash) {
        cb(new Error("两次密码不同"));
      } else {
        cb();
      }
    };
    return {
      rules: {
        name: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true,validator: validMobileNoRequired, trigger: 'blur' }
        ],
        email: [
          { required: true,validator: validEmailRequired, trigger: 'blur' }
        ],
        passwordHash: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ],
        confirm: [
          { required: true,validator: validRepassword, trigger: 'blur' }
        ]
      },
      title:'',
      form:{},
      showDraw:false,
      columns: [
        {
          title: '用户名',
          key: 'name',
        },
        {
          title: '手机号',
          key: 'phone',
        },
        {
          title: '电子邮件',
          key: 'email',
        },
        {
          title: '类型',
          key: 'typeName',
        },
        {
          title: '邀请码',
          key:'inviteCode'
        },
        {
          title: '邀请人数',
          key:'inviteCount'
        },
        {
          title: '邀请链接',
          key:'inviteLink'
        },
        {
          title: '注册时间',
          key: 'createTime',
          slot:'createTime'
        },
        {
          title: '用户状态',
          slot: 'status'
        },
        // {
        //   title: '操作',
        //   slot: 'action',
        //   width: 180,
        //   align: 'center'
        // }
      ],
      // isChangePass: false,
      changepwd: false,
      form:{
        oldPassword:'',
        newPassword:'',
        confirmPassword:''
      },
    };
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
          type: 'text',
          label: '手机号码',
          field: 'phone'
        },
        {
          type: 'text',
          label: '邮箱',
          field: 'email'
        },
        {
          type: 'text',
          label: '邀请码',
          field: 'inviteCode'
        },
      ];
    },
    moreForm() {
      return []
    }
  },
  methods: {
    // add() {
    //   this.form = {};
    //   this.title = '添加用户'
    //   this.showDraw = true;
    // },
    // async ok(){
    //   const valid = await this.$refs.form.validate();
    //   if (!valid) return;
    //   const res = await create_member(this.form)
    //   if(res.status<400){
    //     this.$Message.success(`添加成功`);
    //   }
    //   this.showDraw = false
    //   this.getData()
    // },
    // changepwds(){
    //   this.isChangePass = true;
    // },
    // changenum(){

    // },
    // changepwdOK(){

    // },
    async setState(value, row, index) {
      let userStatus;
      let title;
      if (value === 1) {
        userStatus = 1;
        title = '使用正常';
      } else {
        userStatus = -1;
        title = '被封停';
      }
      this.$Modal.confirm({
        title: `用户状态`,
        loading: true,
        content: `<p>该用户${title}？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_state_users(row.id, userStatus);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`该用户${title}`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value === 1) {
              row.status = -1;
            } else {
              row.status = 1;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value === 1) {
            row.status = -1;
          } else {
            row.status = 1;
          }
          this.data.splice(index,1,row);
        },
      });
    },
    async getData() {
      this.loading = true;
      const res = await get_users_list_page(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.count;
        this.data = res.data.list;
      }
    },
  },
  
};
</script>
