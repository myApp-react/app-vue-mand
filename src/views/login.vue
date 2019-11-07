<template>
    <div class="login-container">
        <div class="logo">
            <img class="img" src="@/assets/login_logo.png">
        </div>
        <div class="access-form">
            <md-field>
                <md-input-item
                        title="手 机 号"
                        type="phone"
                        v-model="info.mobile"
                        placeholder="请输入电话号码"
                        clearable
                >
                </md-input-item>
                <md-input-item
                        title="验 证 码"
                        class="code-item"
                        type="digit"
                        v-model="info.authCode"
                        placeholder="请输入验证码"
                        maxlength="4"
                >
                    <md-button
                            type="ghost"
                            size="small"
                            slot="right"
                            :disabled="disabledCodeBtn"
                            @click="getCode"
                    >{{button}}
                    </md-button>
                </md-input-item>
            </md-field>

            <!--<button :disabled="disabledCodeBtn" :style="{'background-color':backgroundColor}" class="get-code"-->
            <!--@click="getCode">-->
            <!--{{button}}-->
            <!--</button>-->
            <div class="errors" v-show="error">
                <span>请输入格式正确的手机号</span>
            </div>
        </div>

        <div class="access-submit">
            <md-button :disabled="disabledBtn" @click="callSubmit">
                <md-activity-indicator
                        class="md-activity-indicator-css"
                        type="carousel"
                        :size="15"
                        color="#fff"
                        text-color="#fff"
                        v-if="isClick"
                >正在登录
                </md-activity-indicator>
                <span v-else>登 录</span>
            </md-button>
        </div>
        <div class="register-router">
            <router-link to="/register">会员注册</router-link>
        </div>

    </div>
</template>

<script>
    import {login, getAuthCode} from "@/api/access";
    import {InputItem, Field, Button, Toast, ActivityIndicator} from "mand-mobile";

    export default {
        name: "login",
        data() {
            return {
                info: {
                    mobile: "",
                    authCode: ""
                },
                disabledCodeBtn: true,
                disabledBtn: true,
                backgroundColor: "#c6c6c6",
                countdown: 60,
                button: "获取验证码",
                interval: 0,
                error: false,
                isClick: false,
            };
        },
        watch: {
            info: {
                handler(newValue, oldValue) {
                    let mobileValidate = /^1[34578][0-9]{9}$/.test(newValue.mobile)
                    if (mobileValidate) {
                        this.disabledCodeBtn = false
                        this.backgroundColor = "#2994cf";
                        this.error = false
                    } else {
                        this.error = true
                    }
                    if (mobileValidate && newValue.authCode.length === 4) {
                        this.disabledBtn = false
                    } else {
                        this.disabledBtn = true
                    }
                },
                deep: true
            }
        },
        components: {
            [InputItem.name]: InputItem,
            [Field.name]: Field,
            [ActivityIndicator.name]: ActivityIndicator,
            [Button.name]: Button
        },
        created() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        },
        methods: {
            async callSubmit() {
                this.isClick = true;
                this.disabledBtn = true;
                let data = {mobile: this.info.mobile, code: this.info.authCode}
                try {
                    let res = await login(data);
                    let intention = sessionStorage.getItem('intention') || ''
                    this.isClick = false;
                    this.disabledBtn = false;
                    if (intention.startsWith('#')) {
                        sessionStorage.removeItem('intention');
                        this.$router.push(intention.slice(1))
                    } else {
                        this.$router.push('/home')
                    }
                } catch (error) {
                    this.isClick = false;
                    this.disabledBtn = false;
                    Toast.info(error)
                }
            },
            async getCode() {
                try {
                    let res = await getAuthCode({mobile: this.info.mobile}, 'loginCode');
                    this.disabledCodeBtn = true;
                    this.backgroundColor = "";
                    this.counter();
                } catch (error) {
                    Toast.info(error)
                }
            },
            counter() {
                this.interval = setInterval(_ => {
                    this.button = `${this.countdown} 秒后重发`;
                    this.countdown--;
                    if (this.countdown < 0) {
                        clearInterval(this.interval);
                        this.countdown = 60
                        this.backgroundColor = "#2994cf";
                        this.button = `获取验证码`;
                        this.disabledCodeBtn = false;
                    }
                }, 1000);
            },
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .login-container {
        .md-field .md-field-content .md-input-item-container::before {
            height: 4px;
            background-color: #000;
        }

        .md-activity-indicator-svg {
            width: 60px !important;
            height: 16px !important;
        }

        .md-field .md-field-content .code-item .md-input-item-container::before {
            width: 66%;
        }

        .md-input-item .md-input-item-title {
            width: 150px;
            font-size: 30px;
        }

        .md-input-item .md-input-item-control .md-input-item-input {
            font-size: 30px;
        }

        .code-item .md-input-item-control .md-input-item-right {
            width: 200px;
            justify-content: flex-end;
        }

        .md-button.primary {
            position: relative;

            &:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }

        .md-button.ghost.small {
            padding: 0 12px;
            width: auto;
            height: 60px;
            line-height: 60px;
            color: #111;
            font-size: 26px;

            &:after {
                border-color: #111;
            }
        }

        .md-button.primary {
            background-color: #ff4602;

            &:disabled {
                background-color: #ccc;
            }
        }


    }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
    .login-container
        width 100%
        height 100%
        padding 130px 50px 0
        box-sizing border-box
        background-color #ECEFF5

        .code-item
            margin-top 50px

    .logo
        margin auto
        width 274px
        height 78px

    .logo .img
        display: block
        width 100%
        height 100%

    .access-form
        position relative
        margin-top 90px

        .md-field
            background-color transparent

        .errors
            position absolute
            top 110px
            left 0
            width: 100%;
            padding-left 200px
            box-sizing border-box
            text-align left
            font-size 30px
            line-height: 1.5;
            color #ff4602

    .access-submit
        margin-top 130px
        padding 0 20px

    .access-submit .md-button
        height 80px
        line-height 80px

    .register-router
        margin-top 50px

        a
            display block
            font-size 30px
            font-weight normal
            font-stretch normal
            line-height 36px
            letter-spacing 0px
            color #232323
            text-align center
</style>
