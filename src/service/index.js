import { API } from '@/utils/http';

/**
 * 验证码
 */
export const get_captcha = () => {
  return API.get('/Captcha/api/ImageCaptcha/Captcha');
};

/**
 * 获取上传token
 *
 * @param {*} folder
 * @returns
 */
export const get_upload_token = (folder , fileExtension)=>{
  return API.get(`/api/v1.0/File/Token/${folder}/${fileExtension}`)
}


// ------------------------------------------------
/**
 * 登录
 * @param {*} params
 */
export const login_live_admin = params => {
  return API.post('/api/v1.0/Base/Login', params);
};

/**
 * 查询用户列表
 * @param {*} page 
 * @param {*} limit 
 * @param {*} query 
 */
export const get_users_list_page = (page, limit,query) => {
  return API.get(`/api/v1/Base/UserList/${page}/${limit}`,query);
};

/**
 * 设置用户状态
 * @param {*} id 
 * @param {*} userStatus 
 */
export const set_state_users = (id, userStatus) => {
  return API.post(`/api/v1/Base/UserStatusEdit/${id}/${userStatus}`);
};

/**
 * 查询数据字典列表
 * @param {*} group 
 */
export const get_data_list_page = (group) => {
  return API.get(`/api/v1/Base/DicList/${group}`);
};

/**
 * 数据字典添加
 */
export const add_data_list = (query) => {
  return API.post(`/api/v1/Base/DicAdd`,query);
};

/**
 * 数据字典修改
 */
export const edit_data_list = (query) => {
  return API.post(`/api/v1/Base/DicEidt`,query);
};

/**
 * 数据字典删除
 */
export const delete_data_list = (id) => {
  return API.delete(`/api/v1/Base/DicDelete/${id}`);
};


/**
 * 查询视频列表
 * @param {*} page 
 * @param {*} limit 
 * @param {*} query 
 */
export const get_video_list_page = (page, limit,query) => {
  return API.get(`/api/v1/Video/VideoList/${page}/${limit}`,query);
};

/**
 * 添加视频
 * @param {*} query 
 */
export const add_video_data_list = (query) => {
  return API.post(`/api/v1/Video/VideoAdd`,query);
};

/**
 * 修改视频
 * @param {*} query 
 */
export const update_video_data_list = (query) => {
  return API.post(`/api/v1/Video/VideoEdit`,query);
};

/**
 * 视频删除
 */
export const delete_video_data_list = (id) => {
  return API.delete(`/api/v1/Video/VideoDelete/${id}`);
};

/**
 * 查询公告列表
 * @param {*} page 
 * @param {*} limit 
 * @param {*} query 
 */
export const get_notice_list_page = (page, limit,query) => {
  return API.get(`/api/v1/Notice/GGList/${page}/${limit}`,query);
};

/**
 * 添加公告
 * @param {*} query 
 */
export const add_notice_data_list = (query) => {
  return API.post(`/api/v1/Notice/GGAdd`,query);
};

/**
 * 修改公告
 * @param {*} query 
 */
export const update_notice_data_list = (query) => {
  return API.post(`/api/v1/Notice/GGEdit`,query);
};

/**
 * 公告删除
 */
export const delete_notice_data_list = (id) => {
  return API.delete(`/api/v1/Notice/GGDelete/${id}`);
};

/**
 * 查询广告列表
 * @param {*} query 
 */
export const get_ad_list_page = (query) => {
  return API.get(`/api/v1/AD/AdList`,query);
};

/**
 * 添加广告
 * @param {*} query 
 */
export const add_ad_data_list = (query) => {
  return API.post(`/api/v1/AD/AdAdd`,query);
};

/**
 * 修改广告
 * @param {*} query 
 */
export const update_ad_data_list = (query) => {
  return API.post(`/api/v1/AD/AdEdit`,query);
};

/**
 * 广告删除
 */
export const delete_ad_data_list = (id) => {
  return API.delete(`/api/v1/AD/AdDelete/${id}`);
};

/**
 * 系统设置列表
 * @param {*} query 
 */
export const get_www_setting_page = (query) => {
  return API.get(`/api/v1/Settiings/Settings`,query);
};

/**
 * 修改系统设置
 * @param {*} query 
 */
export const update_www_setting_page = (query) => {
  return API.post(`/api/v1/Settiings/SettingsEdit`,query);
};

/**
 * 查询日常活动任务列表
 * @param {*} query 
 */
export const get_activity_list_page = (query) => {
  return API.get(`/api/v1/Activity/Activities`,query);
};

/**
 * 添加任务
 * @param {*} query 
 */
export const add_activity_data_list = (query) => {
  return API.post(`/api/v1/Activity/ActivityNew`,query);
};

/**
 * 修改任务
 * @param {*} query 
 */
export const update_activity_data_list = (query) => {
  return API.post(`/api/v1/Activity/Activity`,query);
};

/**
 * 任务删除
 */
export const delete_activity_data_list = (id) => {
  return API.delete(`/api/v1/Activity/Activity/${id}`);
};

/**
 * 查询推广活动列表
 * @param {*} query 
 */
export const get_PromoteAchievement_list_page = (query) => {
  return API.get(`/api/v1/PromoteAchievement/PromoteAchievements`,query);
};

/**
 * 添加推广活动
 * @param {*} query 
 */
export const add_PromoteAchievement_data_list = (query) => {
  return API.post(`/api/v1/PromoteAchievement/PromoteAchievementNew`,query);
};

/**
 * 修改推广活动
 * @param {*} query 
 */
export const update_PromoteAchievement_data_list = (query) => {
  return API.post(`/api/v1/PromoteAchievement/PromoteAchievement`,query);
};

/**
 * 推广活动删除
 */
export const delete_PromoteAchievement_data_list = (id) => {
  return API.delete(`/api/v1/PromoteAchievement/PromoteAchievement/${id}`);
};

/**
 * 获取平台列表
 * @param {*} page 
 * @param {*} limit 
 * @param {*} query 
 */
export const get_Platform_list_page = (page, limit,query) => {
  return API.get(`/api/v1/Platform/PageList/${page}/${limit}`,query);
};

/**
 * 是否平台推荐
 */
export const set_Platform_Recommend_state = (id,state) => {
  return API.put(`/api/v1/Platform/UpdateRecommend/${id}/${state}`);
};

/**
 * 开启平台
 */
export const set_Platform_status_state = (id,state) => {
  return API.put(`/api/v1/Platform/UpdateStatus/${id}/${state}`);
};

/**
 * 获取平台主播列表
 * @param {*} page 
 * @param {*} limit 
 * @param {*} query 
 */
export const get_anchor_list_page = (platformId, page, limit, query) => {
  return API.get(`/api/v1/Anchor/PageList/${platformId}/${page}/${limit}`,query);
};


/**
 * 主播金额
 */
export const set_Anchor_Recommend_amount = (query) => {
  return API.post(`/api/v1//Anchor/UpdatePrice`,query);
};

/**
 * 开启主播推荐
 */
export const set_Anchor_Recommend_state = (id,state) => {
  return API.put(`/api/v1/Anchor/UpdateRecommend/${id}/${state}`);
};

/**
 * 查询视频类型列表
 * @param {*} group 
 */
export const get_video_type_list = (query) => {
  return API.get(`/api/v1/VideoType/List`,query);
};

/**
 * 视频类型添加
 */
export const add_video_type_list = (query) => {
  return API.post(`/api/v1/VideoType/Create`,query);
};

/**
 * 视频类型修改
 */
export const update_video_type_list = (query) => {
  return API.put(`/api/v1/VideoType/Edit`,query);
};

/**
 * 视频类型删除
 */
export const delete_video_type_list = (id) => {
  return API.delete(`/api/v1/VideoType/Delete/${id}`);
};

/**
 * 查询小说类型列表
 * @param {*} group 
 */
export const get_Novel_type_list = (query) => {
  return API.get(`/api/v1/NovelType/List`,query);
};

/**
 * 小说类型添加
 */
export const add_Novel_type_list = (query) => {
  return API.post(`/api/v1/NovelType/Create`,query);
};

/**
 * 小说类型修改
 */
export const update_Novel_type_list = (query) => {
  return API.put(`/api/v1/NovelType/Edit`,query);
};

/**
 * 小说类型删除
 */
export const delete_Novel_type_list = (id) => {
  return API.delete(`/api/v1/NovelType/Delete/${id}`);
};

/**
 * 查询图片类型列表
 * @param {*} group 
 */
export const get_Picture_type_list = (query) => {
  return API.get(`/api/v1/PictureType/List`,query);
};

/**
 * 图片类型添加
 */
export const add_Picture_type_list = (query) => {
  return API.post(`/api/v1/PictureType/Create`,query);
};

/**
 * 图片类型修改
 */
export const update_Picture_type_list = (query) => {
  return API.put(`/api/v1/PictureType/Edit`,query);
};

/**
 * 图片类型删除
 */
export const delete_Picture_type_list = (id) => {
  return API.delete(`/api/v1/PictureType/Delete/${id}`);
};

/**
 * 查询图片管理列表
 * @param {*} group 
 */
export const get_Picture_list = (page,limit,query) => {
  return API.get(`/api/v1/Picture/List/${page}/${limit}`,query);
};

/**
 * 图片管理列表添加
 */
export const add_Picture_list = (query) => {
  return API.post(`/api/v1/Picture/Create`,query);
};

/**
 * 图片管理列表修改
 */
export const update_Picture_list = (query) => {
  return API.put(`/api/v1/Picture/Edit`,query);
};

/**
 * 图片管理列表删除
 */
export const delete_Picture_list = (id) => {
  return API.delete(`/api/v1/Picture/Delete/${id}`);
};

/**
 * 查询小说管理列表
 * @param {*} group 
 */
export const get_Novel_list = (page,limit,query) => {
  return API.get(`/api/v1/Novel/List/${page}/${limit}`,query);
};

/**
 * 小说管理列表添加
 */
export const add_Novel_list = (query) => {
  return API.post(`/api/v1/Novel/Add`,query);
};

/**
 * 小说管理列表修改
 */
export const update_Novel_list = (query) => {
  return API.post(`/api/v1/Novel/Edit`,query);
};

/**
 * 小说管理列表删除
 */
export const delete_Novel_list = (id) => {
  return API.delete(`/api/v1/Novel/Delete/${id}`);
};

/**
 * 用户播放次数列表
 * @param {*} group 
 */
export const get_paly_times = (page,limit,query) => {
  return API.get(`/api/v1/UserPlayCount/List/${page}/${limit}`,query);
};

/**
 * 播放次数修改
 */
export const edit_paly_times = (query) => {
  return API.post(`/api/v1/UserPlayCount`,query);
};

/**
 * 用户签到列表
 */
export const get_member_signIn = (query) => {
  return API.get(`/api/v1/MemberSignIn/List`,query);
};

/**
 * 添加签到列表
 */
export const add_member_signIn = (query) => {
  return API.post(`/api/v1/MemberSignIn/Create`,query);
};

/**
 * 修改签到列表
 */
export const edit_member_signIn = (id,query) => {
  return API.put(`/api/v1/MemberSignIn/Edit/${id}`,query);
};

/**
 * 签到状态设置
 */
export const state_member_signIn = (id, status,query) => {
  return API.put(`/api/v1/MemberSignIn/UpdateStatus/${id}/${status}`,query);
};

/**
 * 获取支付平台列表
 */
export const get_PayPlatformConfig = (query) => {
  return API.get(`/api/v1/PayPlatformConfig/List`,query);
};

/**
 * 修改支付平台状态
 */
export const state_PayPlatformConfig = (id, status,query) => {
  return API.put(`/api/v1/PayPlatformConfig/UpdateStatus/${id}/${status}`,query);
};

/**
 * 编辑支付列表
 */
export const edit_PayPlatformConfig = (id,query) => {
  return API.put(`/api/v1/PayPlatformConfig/Edit/${id}`,query);
};

/**
 * 创建支付列表
 */
export const add_PayPlatformConfig = (query) => {
  return API.post(`/api/v1/PayPlatformConfig/Create`,query);
};

/**
 * 钱包管理列表
 * @param {*} group 
 */
export const get_wallet_list = (page,limit,query) => {
  return API.get(`/api/v1/Wallet/List/${page}/${limit}`,query);
};

/**
 * 修改金额
 * @param {*} group 
 */
export const edit_wallet_amount = (id,amount,query) => {
  return API.put(`/api/v1/Wallet/ChangeAmount/${id}/${amount}`,query);
};

/**
 * 修改积分
 * @param {*} group 
 */
export const edit_wallet_integral = (id,integral,query) => {
  return API.put(`/api/v1/Wallet/ChangeIntegral/${id}/${integral}`,query);
};

/**
 * 提现列表
 * @param {*} group 
 */
export const get_WithdrawList = (page,limit,query) => {
  return API.get(`/api/v1/Wallet/WithdrawList/${page}/${limit}`,query);
};

/**
 * 提现审核通过
 */
export const Approve_WithdrawList = (id) => {
  return API.put(`/api/v1/Wallet/Approve/${id}`);
};

/**
 * 提现审核拒绝
 */
export const Deny_WithdrawList = (id,msg) => {
  return API.put(`/api/v1/Wallet/Deny/${id}/${msg}`);
};




/**
 * 获取客服信息
 */
export const get_contact_info = () => {
  return API.get(`/api/v1/Settiings/ContactInfo`);
};

/**
 * 修改客服信息
 */
export const set_contact_info = (query,vue) => {
  return API.post(`/api/v1/Settiings/ContactInfoEdit`,query,vue,{ "Content-Type":"multipart/form-data"});
};

/**
 * 代理等级列表
 * @param {*} group 
 */
export const get_agent_list = (page,limit,query) => {
  return API.get(`/api/v1/AgentConfig/List/${page}/${limit}`,query);
};

/**
 * 代理等级创建
 * @param {*} group 
 */
export const add_agent_list = (query) => {
  return API.post(`/api/v1/AgentConfig/Create`,query);
};

/**
 * 代理等级修改
 * @param {*} group 
 */
export const edit_agent_list = (id,query) => {
  return API.put(`/api/v1/AgentConfig/Edit/${id}`,query);
};

/**
 * 代理等级删除
 * @param {*} group 
 */
export const del_agent_list = (id,query) => {
  return API.delete(`/api/v1/AgentConfig/Delete/${id}`,query);
};

/**
 * 代理等级默认设置
 * @param {*} group 
 */
export const state_agent_list = (id,query) => {
  return API.put(`/api/v1/AgentConfig/SetDefault/${id}`,query);
};



/**
 * 用户代理结构显示
 * @param {*} group 
 */
export const get_agent_tree = (id,query) => {
  return API.get(`/api/v1/Agent/NextNode/${id}`,query);
};

// Agent/StatisticsAmount

/**
 * 用户代理结构显示
 * @param {*} group 
 */
export const get_amount_total = (query) => {
  return API.get(`/api/v1/Agent/StatisticsAmount`,query);
};