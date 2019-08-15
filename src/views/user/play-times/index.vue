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
        <template slot-scope="{ row }" slot="action">
            <Button type="success" size="small" @click="changenum(row)">修改次数</Button>
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

    <Modal title="播放次数修改：" v-model="isChangePass" :mask-closable="false">
      <Form ref="forms" :model="form" :rules="rules" :label-width="150">
        <FormItem label="用户名：" prop="name">
          <Input v-model="form.name" type="text" readonly clearable style="width: 200px" />
        </FormItem>
        <FormItem label="播放次数基数：" prop="playCountBase">
          <InputNumber v-model="form.playCountBase" :min="0" placeholder="播放次数基数" clearable style="width: 200px" ></InputNumber>
        </FormItem>
        <FormItem label="播放次数(当日增加)：" prop="playCountAddToday">
          <InputNumber v-model="form.playCountAddToday" :min="0" placeholder="当日增加播放次数" clearable style="width: 200px" ></InputNumber>
        </FormItem>
        <FormItem label="播放次数(每日增加)：" prop="playCountAddPerDay">
          <InputNumber v-model="form.playCountAddPerDay" :min="0" placeholder="每日增加播放次数" clearable style="width: 200px" ></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isChangePass = false">取消</Button>
        <Button type="primary" :loading="btnLoading" @click="changeCountOK">确定</Button
        >
      </div>
    </Modal>
    
  </div>
</template>

<script>
import mixin from '@/mixins/single-form-mixin';
import {
  get_paly_times,
  edit_paly_times
} from '@/service/index';
export default {
  name: 'play-times',
  mixins: [mixin],
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
      },
      title:'',
      form:{},
      showDraw:false,
      isChangePass: false,
      columns: [
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '播放次数基数',
          key: 'playCountBase'
        },
        {
          title: '当日增加播放次数',
          key: 'playCountAddToday'
        },
        {
          title: '每日增加播放次数',
          key: 'playCountAddPerDay'
        },
        {
          title: '当日使用播放次数',
          key: 'playCountUsedToday'
        },
        {
          title: '操作',
          slot: 'action',
          width: 180,
        }
      ],
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
      ];
    },
    moreForm() {
      return []
    }
  },
  methods: {
    async changeCountOK(){
      this.isChangePass = false;
      this.loading = true;
      const res = await edit_paly_times(this.form);
      this.loading = false;
      if (res.status == 200) {
        this.$Message.info('修改成功！');
      }
    },
    changenum(row){
      this.isChangePass = true;
      this.form = row;
    },
    async getData() {
      this.loading = true;
      const res = await get_paly_times(this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.count;
        this.data = res.data.list;
      }
    },
  },
  
};
</script>
