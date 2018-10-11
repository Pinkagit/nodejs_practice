<template>
     <header>
        <div class="container">
            <div class="logo">
                Translation
            </div>

            <div class="username" @click.stop="loginBox_show">
                <i class="el-icon-location"></i>
                <span>{{ username }}</span>
                <div 
                :class="['loginBox', {'translate_r': isLogin}]" 
                v-show="loginBox_isShow">
                    <el-form ref="form" :model="form" v-show="!isLogin" label-width="60px" size="small">
                        <el-form-item label="用户名">
                            <el-input v-model="form.username"></el-input>
                        </el-form-item>
                            <el-form-item label="密码">
                            <el-input type="password" v-model="form.password" autocomplete="off" @keyup.native.enter="login"></el-input>
                        </el-form-item>

                        <el-form-item style="text-align: right; margin-bottom:0;">
                            <el-checkbox v-model="isKeepUp" style="margin-right: 30px;">保存登入状态</el-checkbox>
                            <el-button @click="login">登入</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="tip" v-show="isLogin" @click.stop="logout">
                        退出
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
             form: {
                username: '',
                password: ''
            },
            loginBox_isShow: false,
            isLogin: false,
            username: '未登入',
            isKeepUp: false
        }
    },
    created() {
        if (this.$store.state.USER) {
            this.username = this.$store.state.USER;
            this.isLogin = true;
        }
    },
    mounted() {
        document.addEventListener("click", this.loginBox_hidden)
    },
    methods: {
        loginBox_show() {
            this.loginBox_isShow = true;
        },
        loginBox_hidden() {
            this.loginBox_isShow = false;
        },
        login() {
            this.$ajax.userLogin(this.form).then(response => {
                console.log(response);
                if (response.data.sta == 1) {
                    this.isLogin = true;
                    this.username = response.data.data.username;
                    this.loginBox_hidden();
                    this.$store.commit("LOGIN", response.data.data);
                    if (this.isKeepUp) {
                        this.$store.commit("KEEP_LOGIN", response.data.data)
                    } else {
                        this.$store.commit("NOT_KEEP_LOGIN")
                    }
                }
            })
        },
        logout() {
            this.$store.commit("LOGOUT");
            this.username = '未登入';
            this.isLogin = false;
            this.loginBox_hidden();
        }
    }
}
</script>

<style lang="scss" scoped>
header {
    width: 100%;
    height: 80px;
    background: #B3C0D1;
    position: fixed;
    box-sizing: border-box;
    z-index: 999;
    .container{
        position: relative;
    }
    .logo {
        position: absolute;
        font-size: 34px;
        font-weight: 700;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        color: #fff;
    }
    .username {
        position: absolute;
        right: 0px;
        height: 100%;
        font-size: 24px;
        line-height: 80px;
        color: #fff;
        cursor: pointer;
        transition: color .2s;
        &:hover{
            color: #5e5e5e;    
        }
        .loginBox {
            position: absolute;
            left: -200%;
            top: 70px;
            box-sizing: border-box;
            background: #fff;
            border: 1px solid rgba(27,31,35,0.15);
            box-shadow: 0 3px 12px rgba(27,31,35,0.15);
            border-radius: 5px;
            &::before {
                content: '';
                display: block;
                position: absolute;
                right: 10px;
                top: -20px;
                width: 0;
                height: 0;
                border: 12px solid transparent;
                border-bottom-color: #fff;
            }
            .el-form {
                margin: 20px;
                width: 260px;
            }
            .tip {
                width: 100px;
                text-align: center;
                font-size: 16px;
                line-height: 1;
                color: #5e5e5e;
                margin: 5px 0;
                padding: 5px 10px;
                &:hover{
                    background: #eee;
                }
            }
        }
        .translate_r {
            left: -55%;
        }
    }
}
</style>
