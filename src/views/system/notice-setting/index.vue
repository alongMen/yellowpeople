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
        <template slot-scope="{ row }" slot="createTime">
           {{formatBeijingDate(row.createTime)}}
        </template>
        <template slot-scope="{ row,index }" slot="action" >
           <Button type="success" @click='edit(row,index)' :loading="btnLoading">编辑</Button>&nbsp;
           <Button type="error" @click='del(row.id)' :loading="btnLoading">删除</Button>
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
      <Form :label-width="100" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20">
          <Col :span="12" >
            <FormItem label="公告标题：" prop="title">
              <Input  v-model="form.title"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
            <FormItem label="公告内容：" prop="content">
              <Input v-model="form.content" type="textarea" :autosize="{minRows: 8,maxRows: 20}" placeholder="请填写公告..." />
            </FormItem>
        </Row>
 
        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="cancelEdit">取消</Button>
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
  get_notice_list_page,
  add_notice_data_list,
  update_notice_data_list,
  delete_notice_data_list
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "notice-setting",
  mixins: [mixin],
  data(){
    return{
      title: '',
      showModal: false,
      isDel: false,
      delID: 0,
      form: {},
      type:'',
      title_header: '',
      columns:[
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '公告内容',
          key: 'content'
        },
        {
          title: '发布时间',
          slot: 'createTime',
          width: 150
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{
        title: [
          { required: true, message: '请填写公告标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写公告', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '公告标题',
          type: 'text',
          field: 'Title'
        },
        {
          label: '公告内容',
          type: 'text',
          field: 'Content'
        },
        {
          label: '发布时间段',
          type: 'timeRange',
          field: 'date',
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
      this.title_header = '公告添加：';
      this.form = {};
    },
    async edit(row){
      this.showModal = true;
      this.form = row;
      this.type = 'edit';
      this.title_header = '公告编辑：';
    },
    del(id){
      this.isDel = true;
      this.delID = id;
    },
    cancelEdit(){
      this.showModal = false;
      this.$Modal.remove();
      this.$refs.form.resetFields();
    },
    async delOK() {
      this.btnLoading = true;
      const res = await delete_notice_data_list(this.delID);
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
        const res = await add_notice_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加公告成功！');
          this.$Modal.remove();
        }
      }else if(this.type === 'edit'){
        const res = await update_notice_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改公告成功！');
          this.$Modal.remove();
        }
      }
      
    },
    async getData() {
      const query = {
        Title:this.query.Title,
        Content:this.query.Content,
        StartTime: this.query.date[0],
        EndTime: this.query.date[1]
      };
      const res = await get_notice_list_page(this.page, this.limit, query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.count;
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