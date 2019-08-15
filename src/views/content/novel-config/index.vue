
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
        <template slot-scope="{ row }" slot="createTime">
           {{formatBeijingDate(row.createTime)}}
        </template>
        <template slot-scope="{ row }" slot="typeList">
           {{row.typeList.join('、')}}
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
      <Form :label-width="120" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20">
          <Col :span="12" >
            <FormItem label="小说标题：" prop="title">
              <Input  v-model="form.title"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="红包金额：" prop="takeAmount">
              <InputNumber v-model="form.takeAmount" size="small" :min='0'></InputNumber>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="积分：" prop="takePoints">
              <InputNumber v-model="form.takePoints"  :min='0' size="small"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="24">
            <FormItem label="小说标签：" prop="typeMark">
              <CheckboxGroup v-model="form.typeMark">
                <Checkbox v-for="item in typeMarkList" :label="item.id" :key="item.id" ref="checkboxGroup">
                  <span>{{item.name}}</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
            <FormItem label="小说简介：" prop="introduction">
              <Input v-model="form.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="小说简介..." />
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
  get_Novel_list,
  update_Novel_list,
  delete_Novel_list,
  get_Novel_type_list
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "picture-config",
  mixins: [mixin],
  data(){
    return{
      typeMarkList:[],
      TypeMarkList: [],
      List:[],
      title: '',
      showModal: false,
      isDel: false,
      delID: 0,
      form: {},
      type:'',
      title_header: '添加小说:',
      columns:[
        {
          title: '标题',
          key: 'title',
        },
        {
          title: '小说简介',
          key: 'introduction',
        },
        {
          title: '小说标签',
          slot: 'typeList',
        },
        {
          title: '红包金额',
          key: 'takeAmount'
        },
        {
          title: '积分',
          key: 'takePoints'
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
          { required: true, message: '请填写标题名称', trigger: 'blur' }
        ],
      }
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '小说标题',
          type: 'text',
          field: 'Title'
        },
        
        {
          label: '关键字',
          type: 'text',
          field: 'KeyWords'
        },
        {
          type: 'CheckButton',
          label: '小说标签',
          options: this.TypeMarkList,
          field: 'typeMarks'
        },
      ]
    },
    moreForm(){
      return []
    }
  },
  methods:{
    async edit(row){
      this.showModal = true;
      this.form = row;
      if(!row.takeAmount){
        this.form.takeAmount = 0
      }
      if(!row.takePoints){
        this.form.takePoints = 0
      }
      this.type = 'edit';
      this.title_header = '小说编辑：';
    },
    del(id){
      this.isDel = true;
      this.delID = id;
    },
    async delOK() {
      this.btnLoading = true;
      const res = await delete_Novel_list(this.delID);
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

      }else{
        delete this.form.typeList;
        const res = await update_Novel_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改小说成功！');
          this.$Modal.remove();
        }
      }
      
    },
    async getData() {
      this.loading = true;
      if(typeof this.query.typeMarks == "object"){
        this.query.typeMark = this.query.typeMarks.join(',');
        delete this.query.typeMarks;
      }
      
      const res = await get_Novel_list(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.count;
        this.data = res.data.list;
          this.data.forEach(v=>{
            v.typeList = [];
            if(this.TypeMarkList){
              this.TypeMarkList.forEach(item=>{
                if(v.typeMark){
                  v.typeMark.forEach(items=>{
                    if(item.value == items){
                      v.typeList.push(item.label);
                    }
                  })
                }
              })
            }
          })
      }
    },
    async getTypeMarkList(){
      this.loading = true;
      const res = await get_Novel_type_list(this.query);
      this.loading = false;
      if (res.status < 400) {
        // console.log(res.data);
        this.typeMarkList = res.data;
        this.typeMarkList.map(item=>{
          this.TypeMarkList.push({label:item.name,value:item.id})
        })
      }else{
        this.$Message.success('小说标签获取错误！');
      }
    }
  },
  mounted() {
    this.getTypeMarkList();
    this.getData();
  },
}
</script>
<style lang="less" scoped>
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
</style>