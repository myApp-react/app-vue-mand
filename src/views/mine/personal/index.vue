<template>
    <!--提交-->
    <div class="personal-data-container">
        <div class="userHandle">
            <md-field title="">
                <md-field-item
                        name="avatar"
                        title="用户头像"
                        align="right"
                        arrow="arrow-right"
                        :disabled="unploadImgSatus"
                        @click="chooseImage"
                >
                    <div class="avatars">
                        <img :src="avatars" alt="">
                    </div>
                </md-field-item>
                <md-input-item
                        title="昵称"
                        name="nikename"
                        :value="personalData.nickName ? personalData.nickName : '未知'"
                        placeholder=""
                        disabled
                        align="right"
                >
                    <md-icon name="arrow-right" size="lg" style="color: #ccc" slot="right"></md-icon>
                </md-input-item>
                <md-input-item
                        title="姓名"
                        name="username"
                        v-model="personalData.fullName"
                        placeholder="请输入姓名"
                        :disabled="isDisabled"
                        align="right"
                >
                    <md-icon name="arrow-right" size="lg" style="color: #ccc" slot="right"></md-icon>
                </md-input-item>
                <md-input-item
                        title="邮箱"
                        name="email"
                        v-model="personalData.email"
                        placeholder="请输入电子邮箱"
                        :disabled="isDisabled"
                        :error="emailTips"
                        align="right"
                >
                    <md-icon name="arrow-right" size="lg" style="color: #ccc" slot="right"></md-icon>
                </md-input-item>
                <md-field-item
                        name="item0"
                        title="手机号"
                        :value="mobile"
                        align="right"
                        arrow="arrow-right"
                        disabled>
                </md-field-item>
                <md-field-item
                        name="item1"
                        title="性别"
                        :value="gender"
                        align="right"
                        arrow="arrow-right"
                        :disabled="isDisabled"
                        @click="isSexShow = true"
                >
                </md-field-item>
                <md-field-item
                        name="item2"
                        title="出生日期"
                        :value="personalData.birthdayStr ? personalData.birthdayStr : '未知'"
                        align="right"
                        arrow="arrow-right"
                        :disabled="isDisabled"
                        @click="isDatePickerShow = true"
                >
                </md-field-item>
                <md-field-item
                        name="item3"
                        title="家庭状况"
                        :value="relationship"
                        align="right"
                        arrow="arrow-right"
                        :disabled="isDisabled"
                        @click="isFamilyPickerShow0 = true"
                >
                </md-field-item>
            </md-field>

            <md-picker
                    ref="sexPicker"
                    v-model="isSexShow"
                    :data="SexpickerData"
                    @confirm="SexConfirm"
                    :default-index="defauSex"
                    :key="sexKey"
                    title="选择性别"
            ></md-picker>
            <md-picker
                    ref="picker0"
                    v-model="isFamilyPickerShow0"
                    :data="FamilyData"
                    :default-index="defauFamily"
                    @confirm="onPickerConfirm(0)"
                    :key="FamilyKey"
                    title="选择家庭状况"
            ></md-picker>
            <md-date-picker
                    ref="datePicker"
                    v-model="isDatePickerShow"
                    type="custom"
                    today-text="&(今天)"
                    title="选择出生日期"
                    :minDate="new Date('1880/01/01 00:00')"
                    is-twelve-hours
                    :text-render="textRender"
                    :custom-types="['yyyy', 'MM','dd']"
                    :default-date="currentDate"
                    @confirm="onDatePickerConfirm"
                    :key="dataKey"
            ></md-date-picker>
        </div>
        <div class="fixed-btn-personal">
            <md-button :disabled="isbtnDisabled" class="editBtn" v-if="iseditBtn" @click="editHandle">编辑信息</md-button>
            <md-button @click="saveHandle" v-else>保存信息</md-button>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import Vue from "vue";
    import {
        Picker,
        Field,
        FieldItem,
        Dialog,
        InputItem,
        Switch,
        DatePicker,
        Icon,
        Button,
        Toast
    } from "mand-mobile";

    import {getUserinfo, editUserinfo, uploadHeadImg} from "@/api/mine";
    import {jssdk} from "@/api/smallVotePoints";
    import dayjs from "dayjs";
    import wx from "weixin-js-sdk";

    export default {
        name: "personal",
        inject: ['reload'], // 引入方法
        components: {
            [Dialog.name]: Dialog,
            [Field.name]: Field,
            [FieldItem.name]: FieldItem,
            [InputItem.name]: InputItem,
            [Switch.name]: Switch,
            [DatePicker.name]: DatePicker,
            [Button.name]: Button,
            [Icon.name]: Icon,
            [Picker.name]: Picker
        },
        data() {
            return {
                personalData: {
                    id: "",
                    nickName: "",
                    fullName: "",
                    email: "",
                    gender: "",
                    birthdayStr: "",
                    relationship: ""
                },
                avatars: "",
                chooseImg: '',
                nikeNameTips: "",
                emailTips: "",
                mobile: "",
                iseditBtn: true,
                currentDate: new Date(),
                defauFamily: [0],
                defauSex: [0],
                isFamilyPickerShow0: false,
                isSexShow: false,
                isDatePickerShow: false,
                isDisabled: true,
                btnText: "编辑",
                isbtnDisabled: true,
                dataKey: Math.random(),
                FamilyKey: Math.random(),
                sexKey: Math.random(),
                btnStatus: false,
                localId: '',
                FamilyData: [
                    [
                        {
                            text: "未知",
                            value: 0
                        },
                        {
                            text: "未婚",
                            value: 1
                        },
                        {
                            text: "已婚",
                            value: 2
                        }
                    ]
                ],
                SexpickerData: [
                    [
                        {
                            text: "未知",
                            value: 0
                        },
                        {
                            text: "男",
                            value: 1
                        },
                        {
                            text: "女",
                            value: 2
                        }
                    ]
                ]
            };
        },

        computed: {
            ...mapGetters(["sidebar", "avatar"]),
            gender() {
                return this.personalData.gender === 0
                    ? "未知"
                    : this.personalData.gender === 1
                        ? "男"
                        : this.personalData.gender === 2
                            ? "女"
                            : "未知";
            },
            relationship() {
                return this.personalData.relationship === 1 ? "未婚" : this.personalData.relationship === 2 ? "已婚" : "未知";
            },
            unploadImgSatus() {
                let initSatus = true
                if (this.btnStatus) {
                    if (!this.isDisabled) {
                        initSatus = false
                    }
                }
                return initSatus
            }
        },
        watch: {
            personalData: {
                handler(newValue, oldValue) {
                    const emailValidate = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
                        newValue.email
                    );
                    //昵称不能为空
                    // if (!newValue.nickName) {
                    //     this.nikeNameTips = "请输入昵称";
                    // } else if (newValue.nickName) {
                    //     this.nikeNameTips = "";
                    // }

                    if (!newValue.email) {
                        this.emailTips = "";
                    } else if (newValue.email) {
                        if (!emailValidate) {
                            this.emailTips = "请输入正确的邮箱";
                        } else {
                            this.emailTips = "";
                        }
                    }
                },
                deep: true
            }
        },
        created() {
            // this.getUserinfo();
            // this.wxConfig();
        },
        activated() {
            this.getUserinfo();
            this.wxConfig();
        },
        methods: {
            async wxConfig() {
                try {
                    const res = await jssdk();
                    const {appid, nonceStr, signature, timestamp} = res.data;
                    console.log(res);
                    wx.config({
                        debug: false,
                        appId: appid,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: ["chooseImage", "uploadImage"]
                    });
                    wx.ready(_ => {
                        this.btnStatus = true;
                    });
                    wx.error(res => {
                        console.log(res);
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            async getUserinfo() {
                Toast.loading("加载中...");
                let initData = []
                let initSexData = []
                try {
                    let res = await getUserinfo();
                    console.log("获取用户信息：", res);
                    const {data} = res;
                    this.personalData = {
                        nickName: data.nickName ? data.nickName : '',
                        fullName: data.fullName ? data.fullName : '',
                        email: data.email ? data.email : '',
                        gender: data.gender,
                        birthdayStr: data.birthday ? dayjs(data.birthday).format(
                            "YYYY-MM-DD"
                        ) : '',
                        relationship: data.relationship
                    };
                    this.avatars = data.headImg ? data.headImg : '';

                    initData.push(data.relationship)
                    initSexData.push(data.gender)

                    this.currentDate = data.birthday ? new Date(data.birthday) : new Date();
                    this.defauFamily = initData;
                    this.defauSex = initSexData;
                    this.mobile = data.mobile;
                    this.isbtnDisabled = false;
                    Toast.hide();
                } catch (err) {
                    this.isbtnDisabled = true;
                    Toast.hide();
                }
            },
            async editUserInfo() {
                Toast.loading("修改中...");
                const _self = this;
                try {
                    const res = await editUserinfo(this.personalData);
                    console.log("编辑的结果:", res);
                    if (res.code === "200") {
                        this.iseditBtn = true;
                        this.isDisabled = true;
                        Toast.succeed('修改成功！');
                    }
                } catch (err) {
                    console.log("编辑的结果 报错时:", err);
                    this.iseditBtn = false;
                    this.isDisabled = false;
                    Toast.hide();
                }
            },
            chooseImage() {
                const u = navigator.userAgent;
                const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: res => {
                        const localIds = res.localIds[0].toString(); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        console.log("localIds 没有只吃饭：", localIds)
                        console.log("localIds 转字符串：", res.localIds.toString())
                        this.localId = res.localIds.toString();
                        this.wxuploadImage()
                        if (isiOS) {
                            wx.getLocalImgData({
                                localId: this.localId,
                                success: res => {
                                    let localData = res.localData;
                                    localData = localData.replace('jgp', 'jpeg');
                                    this.chooseImg = localData
                                },
                                fail: res => {
                                    console.log(res)
                                }
                            });
                        } else {
                            console.log("是iPhone")
                            this.chooseImg = this.localId;
                        }
                    }
                });
            },
            wxuploadImage() {
                wx.uploadImage({
                    localId: this.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: res => {
                        //this.serverId = res.serverId; // 返回图片的服务器端ID
                        this.uploadHeadImg(res.serverId);
                    }, fail: _ => {
                        console.log('uploadImage fail');
                    },
                });
            },
            async uploadHeadImg(serverId) {
                try {
                    const res = await uploadHeadImg({mediaId: serverId})
                    console.log('上传头像返回结果：', res)
                    const {code} = res;
                    if (code === "200") {
                        //成功显示这个
                        this.avatars = this.chooseImg;
                        Toast.succeed('头像上传成功');
                    }
                } catch (e) {
                    console.log('上传头像失败：', e);
                    Toast.failed("头像上传失败！")
                }
            },
            editHandle() {
                this.iseditBtn = false;
                this.isDisabled = false;
            },
            saveHandle() {
                if (!this.emailTips) {
                    this.editUserInfo();
                }
            },
            onPickerConfirm(index) {
                let initData = [];
                const values = this.$refs[`picker${index}`].getColumnValues();
                this.personalData.relationship = values[0].value;

                console.log("values", values);
                initData.push(values[0].value)

                this.FamilyKey++;//动态改变它的key值 强制渲染
                this.defauFamily = initData;
                this.isFamilyPickerShow0 = false;
            },
            SexConfirm() {
                let initData = [];
                const values = this.$refs[`sexPicker`].getColumnValues();
                this.personalData.gender = values[0].value;
                initData.push(values[0].value)

                this.sexKey++;//动态改变它的key值 强制渲染
                this.defauSex = initData;
                this.isSexShow = false;

            },
            textRender() {
                const args = Array.prototype.slice.call(arguments);
                const typeFormat = args[0]; // 类型
                const column2Value = args[3]; // 第3列选中值

                if (typeFormat === "dd") {
                    return `${column2Value}日`;
                }
            },
            onDatePickerConfirm(columnsValue) {
                const newDate = this.$refs.datePicker.getFormatDate(
                    "yyyy-MM-dd"
                );
                //日期确认
                this.personalData.birthdayStr = newDate;
                this.dataKey++;//动态改变它的key值 强制渲染
                this.currentDate = new Date(newDate);
                this.isDatePickerShow = false;
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .personal-data-container {
        .md-field-item.disabled .md-field-item-inner .md-field-item-label {
            opacity: 1;
        }

        .fixed-btn-personal {
            position: relative;
            z-index: 9999;

            .md-button.primary {
                background-color: #FF4602;
            }

            .md-button.editBtn.primary {
                background-color: #2c6cf5;
            }

            .editBtn.primary:disabled {
                background-color: #ccc;
            }
        }

        .md-input-item .md-input-item-control .md-input-item-input {
            padding-right: 30px;
        }

        .md-input-item .md-input-item-control .md-input-item-right {
            right: -12px;
        }
    }

    .personal-dialog {
        .md-dialog-text {
            width: 100%;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .md-button .md-button-inner {
        position: relative;
        z-index: 0;
    }

    .personal-data-container {
        position: relative;
        width: 100%;
        height: 100%;
        padding-bottom: 100px;
        box-sizing: border-box;
        background-color: #eceff5;

        .fixed-btn-personal {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .avatars {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            background: url(../../../assets/avatars.png) no-repeat;
            background-size: 100% 100%;

            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
