
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
        <template slot-scope="{ row }" slot="coverLink">
          <img :src="row.coverLink" width="40" height="40" alt="">
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
            <FormItem label="视频标题：" prop="title">
              <Input  v-model="form.title"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="视频描述：" prop="desc">
              <Input v-model="form.desc"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="视频封面：" prop="cover">
              <Input v-model="form.cover"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="视频封面链接：" prop="coverLink">
              <Input v-model="form.coverLink"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="24">
            <FormItem label="视频标签：" prop="typeMark">
              <CheckboxGroup v-model="form.typeMark">
                <Checkbox v-for="item in typeMarkList" :label="item.id" :key="item.id" ref="checkboxGroup">
                  <span>{{item.name}}</span>
                </Checkbox>
              </CheckboxGroup>
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
          <Col :span="20">
            <FormItem label="视频链接：" prop="videoLink">
              <Input v-model="form.videoLink"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col :span="12" >
            <FormItem label="视频导演：" prop="director">
              <Input  v-model="form.director"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="视频演员：" prop="actor">
              <Input v-model="form.actor"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
            <FormItem label="视频简介：" prop="introduction">
              <Input v-model="form.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="视频简介..." />
            </FormItem>
        </Row>
        <Row :gutter="20">
            <FormItem label="视频文章：" prop="article">
              <Input v-model="form.article" type="textarea" :autosize="{minRows: 2,maxRows: 8}" placeholder="视频文章..." />
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
  get_video_list_page,
  set_state_game,
  add_video_data_list,
  update_video_data_list,
  delete_video_data_list,
  get_video_type_list
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "video-config",
  mixins: [mixin],
  data(){
    return{
      typeMarkList:[],
      TypeMarkList: [],
      title: '',
      showModal: false,
      isDel: false,
      delID: 0,
      form: {},
      type:'',
      title_header: '添加视频:',
      columns:[
        {
          title: '标题',
          key: 'title',
        },
        {
          title: '封面',
          slot: 'coverLink',
          width:100
        },
        {
          title: '视频链接',
          key: 'videoLink',
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
          width:180
        },
      ],
      rules:{
        title: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写视频描述', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请填写视频封面', trigger: 'blur' }
        ],
        coverLink: [
          { required: true, message: '请填写封面连接', trigger: 'blur' }
        ],
        videoLink: [
          { required: true, message: '请填写视频链接', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请填写视频简介', trigger: 'blur' }
        ],
        director: [
          { required: true, message: '请填写视频导演', trigger: 'blur' }
        ],
        actor: [
          { required: true, message: '请填写视频演员', trigger: 'blur' }
        ],
      }
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '视频标题',
          type: 'text',
          field: 'Title'
        },
        
        {
          label: '关键字',
          type: 'text',
          field: 'KeyWords'
        },
        {
          type: 'radioButton',
          label: '是否文章列表',
          options: [
            {label:'是',value:'true'},
            {label:'否',value:'false'},
          ],
          field: 'IsArticle'
        },
      ]
    },
    moreForm(){
      return [
        {
          type: 'CheckButton',
          label: '视频标签',
          options: this.TypeMarkList,
          field: 'typeMarks'
        },
      ]
    }
  },
  methods:{
    add(){
      this.showModal = true;
      this.type = 'add';
      this.title_header = '视频添加：';
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
      this.title_header = '视频编辑：';
    },
    del(id){
      this.isDel = true;
      this.delID = id;
    },
    async delOK() {
      this.btnLoading = true;
      const res = await delete_video_data_list(this.delID);
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
        const res = await add_video_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('添加视频成功！');
          this.$Modal.remove();
        }
      }else{
        const res = await update_video_data_list(this.form);
        this.btnLoading = false;
        if (res.status == 200) {
          this.getData();
          this.showModal = false;
          this.$Message.success('修改视频成功！');
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
      const res = await get_video_list_page(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.count;
        this.data = res.data.list;
      }
    },
    async getTypeMarkList(){
      this.loading = true;
      if(typeof this.query.typeMarks == "object"){
        this.query.typeMark = this.query.typeMarks.join(',');
        delete this.query.typeMarks;
      }
      const res = await get_video_type_list(1, 10000, this.query);
      this.loading = false;
      if (res.status < 400) {
        // console.log(res.data);
        this.typeMarkList = res.data;
        this.typeMarkList.map(item=>{
          this.TypeMarkList.push({label:item.name,value:item.id})
        })
      }else{
        this.$Message.success('视频标签获取错误！');
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