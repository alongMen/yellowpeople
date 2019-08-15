
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
        <template slot-scope="{ row }" slot="coverLink">
          <img :src="row.coverLink" width="40" height="40" alt="">
        </template>
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
      <Form :label-width="120" :model='form' :rules="rules" ref="form" v-if='showModal' >
        <Row :gutter="20">
          <Col :span="12" >
            <FormItem label="标题：" prop="title">
              <Input  v-model="form.title"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="描述：" prop="desc">
              <Input v-model="form.desc"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="封面：" prop="cover">
              <Input v-model="form.cover"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="封面链接：" prop="coverLink">
              <Input v-model="form.coverLink"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="24">
            <FormItem label="图片标签：" prop="typeMark">
              <CheckboxGroup v-model="form.typeMark">
                <Checkbox v-for="item in typeMarkList" :label="item.id" :key="item.id" ref="checkboxGroup">
                  <span>{{item.name}}</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          </Row>
          <Row :gutter="20">
          <Col :span="18">
            <FormItem label="图片链接：" prop="pictureLinks">
              <div v-if="type == 'add' || form.pictureLinks.length == 0">
                <Input v-model="links0" type="text"></Input>
              </div>
              <div v-for="(picurl,picIndex) in links" :key="picIndex" style="display:flex;margin-top:10px;">
                <Input v-model="links[picIndex]" ></Input><Button type="warning" size="small" icon="ios-trash-outline" ghost @click="hanleClose(picIndex)"></Button>
              </div>
            </FormItem>
          </Col>
          <Col :span="6">
            <Button icon="ios-add" type="dashed" size="small" @click="handleAdd()">添加 +</Button>
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
            <FormItem label="图片简介：" prop="introduction">
              <Input v-model="form.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="图片简介..." />
            </FormItem>
        </Row>
        <Row :gutter="20">
            <FormItem label="图片文章：" prop="article">
              <Input v-model="form.article" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="图片文章..." />
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
  get_Picture_list,
  add_Picture_list,
  update_Picture_list,
  delete_Picture_list,
  get_Picture_type_list
} from '@/service/index';
import expandRow from './component/expand.vue';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "picture-config",
  components: { expandRow },
  mixins: [mixin],
  data(){
    return{
      typeMarkList:[],
      TypeMarkList: [],
      links:[],
      links0: '',
      title: '',
      showModal: false,
      isDel: false,
      delID: 0,
      form: {},
      type:'',
      title_header: '添加图片:',
      columns:[
        {
          title:'详情',
          type: 'expand',
          width: 60,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '标题',
          key: 'title',
        },
        {
          title: '封面',
          slot: 'coverLink',
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
        },
        {
          title: '操作',
          slot: 'action',
        },
      ],
      rules:{
        title: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请填写封面', trigger: 'blur' }
        ],
        coverLink: [
          { required: true, message: '请填写封面连接', trigger: 'blur' }
        ],
        // pictureLinks: [
        //   { required: true, message: '请填写链接', trigger: 'blur' }
        // ],
        introduction: [
          { required: true, message: '请填写简介', trigger: 'blur' }
        ],
      }
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '标题',
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
          label: '图片标签',
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
    handleAdd(){
      if(this.links){
        this.links.push("");
      }else{
        this.links = [];
        this.links.push("11");
      }
    },
    hanleClose(picIndex){
      this.links.splice(picIndex, 1);
    },
    add(){
      this.showModal = true;
      this.type = 'add';
      this.title_header = '图片添加：';
      this.links = [];
      this.form = {
        takeAmount:0,
        takePoints:0
      };
    },
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
      if(row.pictureLinks){
        this.links = row.pictureLinks;
      }
      this.title_header = '图片编辑：';
    },
    del(id){
      this.isDel = true;
      this.delID = id;
    },
    async delOK() {
      this.btnLoading = true;
      const res = await delete_Picture_list(this.delID);
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
        if(this.links0){
          this.links.push(this.links0)
        }
        this.form.pictureLinks = this.links;
        if(!this.form.pictureLinks){
          this.$Message.error('请添加图片链接！');
          return false;
        }
        const res = await add_Picture_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加图片成功！');
          this.$Modal.remove();
        }
      }else{
        if(this.links0){
          this.links.push(this.links0)
        }
        this.form.pictureLinks = this.links;
        if(this.form.pictureLinks.length == 0){
          this.$Message.error('请添加图片链接！');
          this.btnLoading = false;
          return false;
        }
        const res = await update_Picture_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改图片成功！');
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
      const res = await get_Picture_list(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.count;
        this.data = res.data.list;
        this.data.forEach(v=>{
          v._expanded=false;
        });
      }
    },
    async getTypeMarkList(){
      this.loading = true;
      const res = await get_Picture_type_list(this.query);
      this.loading = false;
      if (res.status < 400) {
        // console.log(res.data);
        this.typeMarkList = res.data;
        this.typeMarkList.map(item=>{
          this.TypeMarkList.push({label:item.name,value:item.id})
        })
      }else{
        this.$Message.success('图片标签获取错误！');
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