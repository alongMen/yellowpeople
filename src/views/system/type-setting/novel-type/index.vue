<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />
    <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div>
    <div class="table-area">
      <Table :data="data" :loading="loading" :columns="columns">
        <template slot-scope="{ row,index }" slot="actions">
          <Button type='primary' @click="edit(row)" style="margin-right:5px;">编辑</Button>
          <Button type='error' @click="del(row,index)" v-if="row.siteType !== 2" style="margin-right:5px;">删除</Button>
        </template>

      </Table>
    </div>
    <Drawer
      :title="title"
      v-model="showModal"
      width="70"
    >
      <Form :label-width="100" :model='form' ref="form" v-if='showModal' :rules="rules">
        <Row :gutter="20">
          <!-- <Col :span="12" v-if="title != '添加'">
            <FormItem label="ID" prop="id">
              <Input disabled v-model="form.id"></Input>
            </FormItem>
          </Col> -->
          <Col :span="12">
            <FormItem label="名称" prop="name">
              <Input v-model="form.name"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="描述" prop="description">
              <Input type="textarea" :rows="4" v-model="form.description"></Input>
            </FormItem>
          </Col>
        </Row>
 
        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="showModal = false"
            >取消</Button
          >
          <Button type="primary" @click="ok" :loading="btnLoading">确定</Button>
        </div>
      </Form>
    </Drawer>
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_Novel_type_list,
  add_Novel_type_list,
  update_Novel_type_list,
  delete_Novel_type_list
} from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  name: 'video-type',
  mixins: [mixin],
  data() {
    return {
      modal_loading: false,
      title: '',
      form: {},
      columns: [
        {
          title: '序号',
          type: 'index',
          width:200
        },
        {
          title: '名称',
          key: 'name',
          width:300
        },
        {
          title: '描述',
          key: 'description',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 180
        },
      ],
      rules:{
        name: [
          { required: true, message: '请填写视频类型名称', trigger: 'blur' }
        ],
      }
    };
  },
    computed:{
    defaultForm(){
      return [
        {
          label: '类型名称',
          type: 'text',
          field: 'name'
        },
        {
          label: '类型描述',
          type: 'text',
          field: 'description'
        },
      ]
    },
    moreForm(){
      return []
    }
  },
  methods: {
    add() {
      this.form = {}
      this.title = '添加';
      this.showModal = true;
    },
    //
    edit(row) {
      this.form = cloneDeep(row);
      this.title = '编辑';
      this.showModal = true;
    },
    async del(row,index) {
      this.$Modal.confirm({
        title: `提示`,
        loading: true,
        content: `<p>是否删除？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await delete_Novel_type_list(row.id);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`删除成功！`);
            this.data.splice(index,1);
            this.$Modal.remove();
          } else {
            this.$Message.success(`删除失败！`);
            this.$Modal.remove();
          }
        }
      });
    },
    //
    async getData() {
      this.loading = true;
      const res = await get_Novel_type_list(this.query);
      // console.log(res.data);
      this.loading = false;
      if (res.status === 200) {
        this.data = res.data;
      }
    },
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      if(!this.form.name) return;
      if (this.form.id) {
        this.btnLoading = true;
        const res = await update_Novel_type_list(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('修改成功!');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      } else {
        this.btnLoading = true;
        const res = await add_Novel_type_list(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('添加成功！');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      }
    },
  },
};
</script>
