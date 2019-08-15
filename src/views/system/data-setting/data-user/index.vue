<template>
  <div class="main-area">
    <div class="operation">
      <Button type="primary" @click="add">添加</Button>
    </div>
    <div class="table-area">
      <Table :data="data" :loading="loading" :columns="columns">
        <template slot-scope="{ row }" slot="enable">
          <Tag color="green" v-if="row.enable">是</Tag>
          <Tag color="orange" v-if="!row.enable">否</Tag>
        </template>
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
      <Form :label-width="100" :model='form' ref="form" v-if='showModal' >
        <Row :gutter="20" >
          <Col :span="12" v-if="title != '添加'">
            <FormItem label="ID" prop="id">
              <Input disabled v-model="form.id"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="名称" prop="name">
              <Input v-model="form.name"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col :span="12">
            <FormItem label="ICON" prop="icon">
              <Input v-model="form.icon"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="enable">
              <i-switch v-model="form.enable" size="large">
                  <span slot="open">true</span>
                  <span slot="close">false</span>
              </i-switch>
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
  get_data_list_page,
  add_data_list,
  edit_data_list,
  delete_data_list
} from '@/service/index';
import { cloneDeep } from 'lodash';
export default {
  name: 'data-user',
  mixins: [mixin],
  data() {
    return {
      modal_loading: false,
      title: '',
      form: {},
      columns: [
        {
          title: 'ID',
          key: 'id',
        },
        {
          title: '名称',
          key: 'name',
        },
        {
          title: 'ICON',
          key: 'icon',
        },
        {
          title: 'enable',
          slot: 'enable',
        },
        {
          title: '操作',
          slot: 'actions',
          width: 180
        },
      ],
    };
  },
  methods: {
    add() {
      this.form = {}
      this.title = '添加';
      this.showModal = true;
    },
    //
    edit(row) {
      // this.form = cloneDeep(row);
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.icon = row.icon;
      this.form.enable = row.enable;
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
          const res = await delete_data_list(row.id);
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
      const query = {
        website:this.query.website,
        websiteName:this.query.websiteName,
      }
      this.loading = true;
      const group = 'User';
      const res = await get_data_list_page(group);
      // console.log(res);
      this.loading = false;
      if (res.status === 200) {
        const data = res.data;
        this.data = data.list;
      }
    },
    async ok() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      if(!this.form.name) return;
      if (this.form.id) {
        this.btnLoading = true;
        const res = await edit_data_list(this.form);
        this.btnLoading = false;
        if (res.status < 400) {
          this.$Message.success('修改成功!');
          this.showModal = false;
          this.page = 1;
          this.getData();
        }
      } else {
        this.btnLoading = true;
        this.form.group = 'User';
        const res = await add_data_list(this.form);
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
