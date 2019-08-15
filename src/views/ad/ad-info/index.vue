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
        <template slot="image" slot-scope="{ row }">
          <img :src="row.image" width="50" height="50" v-if='row.image'/>
        </template>
        <template slot-scope="{ row }" slot="createTime">
           {{formatBeijingDate(row.createTime)}}
        </template>
        <template slot-scope="{ row }" slot="location">
           <span v-for="(item,index) in adLocationType" :key="index" v-if="item.value === row.location">{{item.label}}</span>
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

    <Drawer
      :title="title"
      v-model="showModal"
      width="70"
    >
      <div class="title_header">{{title_header}}</div>
      <Form :label-width="100" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20">
          <Col :span="12" >
            <FormItem label="公告名称：" prop="name">
              <Input  v-model="form.name"></Input>
            </FormItem>
          </Col>
        </Row>
         <Row :gutter="20">
          <Col :span="12" v-if="this.type === 'add'">
            <FormItem label="广告位置：" prop="location">
              <Select v-model="form.location">
                <Option v-for="item in adLocationType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="页面位置：" prop="pageLocation">
              <Input v-model="form.pageLocation"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="广告图：" prop="image">
              <Input v-model="form.image"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="广告链接：" prop="link">
              <Input v-model="form.link"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
            <FormItem label="备注：" prop="backup">
              <Input v-model="form.backup" type="textarea" :autosize="{minRows: 3,maxRows: 20}" placeholder="请填写备注..." />
            </FormItem>
        </Row>
 
        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="showModal = false">取消</Button>
          <Button type="primary" @click="handleVideoOK" :loading="btnLoading">确定</Button>
        </div>
      </Form>
    </Drawer>

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
  get_data_list_page,
  get_ad_list_page,
  add_ad_data_list,
  update_ad_data_list,
  delete_ad_data_list
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
          title: '广告名称',
          key: 'name'
        },
        {
          title: '广告图',
          slot: 'image'
        },
        {
          title: '广告链接',
          key: 'link'
        },
        {
          title: '广告位置',
          slot: 'location'
        },
        {
          title: '页面位置',
          key: 'pageLocation'
        },
        {
          title: '顺序',
          key: 'order'
        },
        {
          title: '发布时间',
          slot: 'createTime',
          width: 150
        },
        {
          title: '备注',
          key: 'backup'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{
        name: [
          { required: true, message: '请填写公告标题', trigger: 'blur' }
        ],
      }
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          type: 'select',
          label: '广告位置',
          options: adLocationType,
          field: 'Location'
        },
      ]
    },
    moreForm(){
      return []
    }
  },
  methods:{
    add(){
      this.showModal = true;
      this.type = 'add';
      this.title_header = '广告添加：';
      this.form = {};
    },
    async edit(row){
      this.showModal = true;
      this.form = row;
      this.type = 'edit';
      this.title_header = '广告编辑：';
    },
    del(id){
      this.isDel = true;
      this.delID = id;
    },
    async delOK() {
      this.btnLoading = true;
      const res = await delete_ad_data_list(this.delID);
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
        console.log(this.form);
        const res = await add_ad_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加广告成功！');
          this.$Modal.remove();
        }else{
          console.log(res);
        }
      }else if(this.type === 'edit'){
        delete this.form.location;
        const res = await update_ad_data_list(this.form);
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
      const res = await get_ad_list_page(this.query);
      this.loading = false;
      if (res.status < 400) {
        // this.total = res.data.count;
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