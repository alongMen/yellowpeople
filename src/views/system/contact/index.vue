<template>
  <div class="main-area">
    <Row>
        <Col span="15">
            <Card>
                <p slot="title" style="text-align:center;">系统客服设置</p>
                <p class="itemlist"><span>客服QQ二维码：</span><img :src="BASE_URL+form.qqQrcode" alt=""></p>
                <p class="itemlist"><span>客服QQ：</span><span>{{form.qq}}</span></p>
                <p class="itemlist"><span>客服WX二维码：</span><img :src="BASE_URL+form.wxQrcode" alt=""></p>
                <p class="itemlist"><span>客服WX：</span><span>{{form.wx}}</span></p>
                <p class="itemlist" @click="handleEdit"><span>编辑<Icon type="md-create" /></span></p>
            </Card>
        </Col>
    </Row>
    <Modal
        title="系统客服设置："
        width="800"
        v-model="isSettingEdit"
        :styles="{top: '100px'}"
        @on-ok="submitEdit"
        @on-cancel="cancleEdit"
        >
        <Form :label-width="120" class="editForm"  :model='form' :rules="rules" ref="form">
            <Row :gutter="20" >
                <Col span="11">
                <FormItem label="客服QQ:" prop="qq">
                    <Input  v-model="form.qq"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row :gutter="20" >
                <Col span="11">
                <FormItem label="QQ二维码:" prop="qqQrcode">
                    <!-- <img :src="BASE_URL+form.wxQrcode" alt="" class="qrcode"> -->
                    <div class="form-group">
                        <div class="control-form">
                            <ul class="upload-imgs">
                            <li v-if="imgLenQQ>1 ? false : true">上传QQ二维码
                                <input type="file" class="upload" @change="addImgQQ($event)" ref="inputerQQ" multiple accept="image/png,image/jpeg,image/gif,image/jpg"/>
                                <a class="add"><i class="iconfont icon-plus"></i><p></p></a>
                            </li>
                            <li v-for='(value, key) in imgsQQ' :key="key">
                                <p class="img"><img :src="getObjectURLQQ(value)"></p>
                            </li>
                            </ul>
                        </div>
                    </div>
                </FormItem>
                </Col>
            </Row>
            <Row :gutter="20" >
            <Col span="11">
                <FormItem label="客服微信:" prop="wx">
                    <Input  v-model="form.wx"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row :gutter="20" >
                <Col span="11">
                <FormItem label="微信二维码:" prop="wxQrcode">
                    <div class="form-group">
                        <div class="control-form">
                            <ul class="upload-imgs">
                            <li v-if="imgLenWX>1 ? false : true">上传微信二维码
                                <input type="file" class="upload" @change="addImgWX($event)" ref="inputerWX" multiple accept="image/png,image/jpeg,image/gif,image/jpg"/>
                                <a class="add"><i class="iconfont icon-plus"></i><p></p></a>
                            </li>
                            <li v-for='(value, key) in imgsWX' :key="key">
                                <p class="img"><img :src="getObjectURLWX(value)"></p>
                            </li>
                            </ul>
                        </div>
                    </div>
                </FormItem>
                </Col>
            </Row>
        </Form>
    </Modal>
  </div>
</template>

<script>
import { 
  get_contact_info,
  set_contact_info
} from '@/service/index';
export default {
  name: "www-setting",
  data(){
    return{
        formData:new FormData(),
        imgsQQ: {},
        imgLenQQ:0,
        imgsWX: {},
        imgLenWX:0,
        filQQ:Object,
        filWX:Object,
        BASE_URL:'',
        title: '',
        isSettingEdit: false,
        form: {},
        btnLoading: true,
        rules:{
            webName: [
            { required: true, message: '请填写网站名称', trigger: 'blur' }
            ],
            appName: [
            { required: true, message: '请填写App名称', trigger: 'blur' }
            ]
        }
    }
  },
  computed:{

  },
  methods:{
    cancleEdit(){
      this.isSettingEdit = false;
      this.getData();
    },
    async submitEdit(){
        // for(let key in this.imgsQQ){
        //     let name=key.split('?')[0];
        //     this.formData.append('qqQrcode',this.imgsQQ[key],name);
        // }
        // for(let key in this.imgsWX){
        //     let name=key.split('?')[0];
        //     this.formData.append('wxQrcode',this.imgsWX[key],name);
        // }
        this.btnLoading = true;
        this.formData.append("QQ", this.form.qq);
        this.formData.append("WX", this.form.wx);
        this.formData.append("Id", this.form.id);
        const res = await set_contact_info(this.formData);
        this.btnLoading = false;
        if (res.status == 200) {
            this.$Message.success('修改成功！');
            this.getData();
        }
    },
    handleEdit(){
      this.isSettingEdit = true;
    },
    async getData() {
      const res = await get_contact_info();
    //   console.log(111111)
      if (res.status == 200) {
          this.form = res.data;
        // console.log(this.form);
      }
    },
    addImgQQ(event){
        // console.log(event);
        this.formData.append('QQQrcode',event.target.files[0])
        let inputDOM = this.$refs.inputerQQ;
        // 通过DOM取文件数据
        this.filQQ = inputDOM.files;
        let oldLen=this.imgLenQQ;
        let len=this.filQQ.length+oldLen;
        if(len>1){
            alert('一次只能上传一张，修改请刷新页面重新选择');
            return false;
        }
        for (let i=0; i < this.filQQ.length; i++) {
            let size = Math.floor(this.filQQ[i].size / 1024);
            if (size > 5*1024*1024) {
            alert('请选择5M以内的图片！');
            return false
            }
            this.imgLenQQ = 1;
            this.$set(this.imgsQQ,this.filQQ[i].name+'?'+new Date().getTime()+i,this.filQQ[i]);
        }
    },
    addImgWX(event){
        this.formData.append('WXQrcode',event.target.files[0])
        let inputDOM = this.$refs.inputerWX;
        // 通过DOM取文件数据
        this.filWX = inputDOM.files;
        let oldLen=this.imgLenWX;
        let len=this.filWX.length+oldLen;
        if(len>1){
            alert('一次只能上传一张，修改请刷新页面重新选择');
            return false;
        }
        for (let i=0; i < this.filWX.length; i++) {
            let size = Math.floor(this.filWX[i].size / 1024);
            if (size > 5*1024*1024) {
            alert('请选择5M以内的图片！');
            return false
            }
            this.imgLenWX = 1;
            this.$set(this.imgsWX,this.filWX[i].name+'?'+new Date().getTime()+i,this.filWX[i]);
        }
    },
    getObjectURLQQ(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    },
    getObjectURLWX(file) {
        
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    },
  },
    mounted() {
        this.BASE_URL = process.env.VUE_APP_REQUEST_URL;
        this.getData();
    }
}
</script>
<style lang="less" scoped>
.main-area{
  padding: 50px;
  min-height: 600px;
  .itemlist{display: flex; line-height:30px;text-align: right;margin: 15px;
   span:first-child{width: 120px;text-align: right;}
   span:last-child{width: 120px;text-align: right;padding-left: 110px}
   img{width: 100px;height: 160px;margin-left: 100px}
  }
  .itemlist:last-child{color: rgb(174, 0, 255);padding-right:20px;
    span{
      width:100%;
      font-size:16px;
      cursor: pointer;
      &:hover{color:#3b69e2;}
    .ivu-icon{line-height: 32px;padding-left: 5px;}
    }
  }
  .editForm{padding: 20px;box-sizing: border-box;}
}

.ivu-row{margin-right: 15px!important;}
.qrcode{width: 100px;height: 160px;}


.upload-imgs{margin: 10px 0 30px 0;overflow: hidden;font-size: 0;}
.upload-imgs li{position: relative;width: 140px;min-height: 40px;font-size: 14px;display: inline-block;padding: 10px;margin-right: 25px;border: 2px dashed #ccc;text-align: center;vertical-align: middle;}
.upload-imgs li:hover{border-color: #ccc;}
.upload-imgs li:first-child{height: 40px;background-color: fff;line-height: 19px;cursor: pointer;}
.upload-imgs .add{display: block;background-color: #fff;color: #ffffff;height: 40px;padding: 8px 0;}
.upload-imgs .add .iconfont{padding: 10px 0;font-size: 40px;}
.upload-imgs li:hover .add{background-color: #fff;}
.upload-imgs li .upload{position: absolute;top: 0;bottom: 0;left: 0;right: 0;width: 140px;height: 40px;opacity: 0;}
.upload-imgs .img{position: relative;width: 100px;min-height: 160px;}
.upload-imgs .img img{vertical-align: middle;width: 100px;min-height: 160px;}
.upload-imgs li:hover .img .close{display: block;position: absolute;right: -6px;top: -10px;line-height: 1;font-size: 22px;color: #aaa;}
</style>