<template>
  <div class="main-area">
    
    <Row :gutter="32">
        <Col span="24" class="demo-tabs-style2">
            <Tabs type="card">
                <TabPane label="邮件模板" icon="ios-mail-outline" name="emailTpl">
                  <p class="itemlist"><span>邮件用户名：</span><span>{{form.userName}}</span></p>
                  <Card>
                    <Row>
                      <p class="itemlist" @click="handleEdit('email')"><span>编辑<Icon type="md-create" /></span></p>
                    </Row>
                    <Form  class="editForm"  :model='form' :rules="rules" ref="emailForm" >
                      <FormItem  prop="emailTemp">
                        <Input :readonly="isReadOnly" v-model="form.emailTemp" type="textarea" :autosize="{minRows: 15,maxRows: 30}" placeholder="请填写邮件模板..."></Input>
                      </FormItem>
                      <FormItem v-if="isEmailEdit">
                        <Button  shape="circle" @click="cancleEdit">取消</Button>&nbsp;&nbsp;
                        <Button type="info" shape="circle" @click="submitEdit">保存</Button>
                      </FormItem>
                    </Form>
                  </Card>
                </TabPane>
                <TabPane  label="短信模板" icon="ios-chatboxes" name="messageTpl">
                  <p class="itemlist"><span>短信用户名：</span><span>{{form.userName}}</span></p>
                  <Card>
                    <Row>
                      <p class="itemlist" @click="handleEdit('msg')"><span>编辑<Icon type="md-create" /></span></p>
                    </Row>
                    <Form  class="editForm"  :model='form' :rules="rules" ref="messageForm">
                      <FormItem  prop="msgTemp">
                        <Input :readonly="isReadOnly" v-model="form.msgTemp" type="textarea" :autosize="{minRows: 15,maxRows: 30}" placeholder="请填写短信模板..."></Input>
                      </FormItem>
                      <FormItem v-if="isMsgEdit">
                        <Button  shape="circle" @click="cancleEdit">取消</Button>&nbsp;&nbsp;
                        <Button type="info" shape="circle" @click="submitEdit">保存</Button>
                      </FormItem>
                    </Form>
                  </Card>
                </TabPane>
            </Tabs>
        </Col>
    </Row>
    <Modal
        v-model="isSub"
        title="提示："
        :loading="btnLoading"
        @on-ok="subOK">
        <p>确认提交？</p>
    </Modal>
  </div>
</template>

<script>
import { 
  get_www_setting_page,
  update_www_setting_page
} from '@/service/index';
export default {
  name: "www-setting",
  data(){
    return{
      isEmailEdit: false,
      isMsgEdit: false,
      isReadOnly: true,
      isSub: false,
      form: {},
      btnLoading: true,
      rules:{
        emailTemp: [
          { required: true, message: '请填写邮件模板！', trigger: 'blur' }
        ],
        msgTemp: [
          { required: true, message: '请填写短信模板！', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{

  },
  methods:{
    cancleEdit(){
      this.isReadOnly = true;
      this.isEmailEdit = false;
      this.isMsgEdit = false;
      this.getData();
    },
    submitEdit(){
      this.isSub = true;
    },
    async subOK(){
      this.btnLoading = true;
      const res = await update_www_setting_page(this.form);
      this.btnLoading = false;
      if (res.status == 200) {
        this.$Message.success('修改成功！');
        this.isEmailEdit = false;
        this.isMsgEdit = false;
        this.isReadOnly = true;
      }
    },
    handleEdit(type){
      if(type==='email'){
        this.isEmailEdit = true;
      }else if(type==='msg'){
        this.isMsgEdit = true;
      }
      this.isReadOnly = false;
    },
    async getData() {
      this.btnLoading = true;
      const res = await get_www_setting_page();
      this.btnLoading = false;
      if (res.status == 200) {
        this.form = res.data;
      }
    },
  },
  mounted() {
    this.getData();
  },
}
</script>
<style lang="less" scoped>
.main-area{
  padding: 50px;
  min-height: 600px;
  .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
        border-radius: 0;
        background: #fff;
    }
    .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
        border-top: 1px solid #3399ff;
    }
    .demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #3399ff;
        position: absolute;
        top: 0;
        left: 0;
    }
  .editForm{padding: 20px;box-sizing: border-box;}
}

.ivu-row{margin-right: 15px!important;}
.itemlist{line-height:30px;text-align:center;font-weight:600;font-size:14px;padding-bottom:20px;
  span:first-child{width: 120px;text-align: right;}
}
.itemlist:last-child{color: rgb(174, 0, 255);text-align: right;display: flex;
    span{
      width:100%;
      font-size:16px;
      cursor: pointer;
      &:hover{color:#3b69e2;}
    .ivu-icon{line-height: 32px;padding-left: 5px;}
    }
  }

</style>