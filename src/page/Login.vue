<template>
  <div class="login_container">
    <h3 style="text-align:left;color:#fff;font-size:20px;">
      聚美优品后台管理系统 版本号：V1.0.0.01
    </h3>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <span style="line-height:130px;font-size:24px;font-weight:500;"
          >用户登录</span
        >
    
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="80px"
        class="login_form"
      >
        <div style="display:none">{{ Exist }}</div>
        <!-- 用户名 -->
        <el-row>
          <el-col>
            <el-form-item prop="username" label="用户名">
              <el-input
                v-model="loginForm.username"
                prefix-icon="iconfont icon-user"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 密码 -->
        <el-row>
          <el-col>
            <el-form-item prop="password" label=" 密码">
              <el-input
                v-model="loginForm.password"
                prefix-icon="iconfont icon-3702mima"
                type="password"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--   验证码-->
        <!-- <el-form-item prop="captcha_code">
          <el-input
            v-model="captcha_code"
            prefix-icon="iconfont icon-3702mima"
            placeholder="验证码"
            @keyup.enter.native="handleLogin"
            style="float: left; width: 122px;"
          ></el-input>
          <div class="captcha_code" ref="code" @click="changeCode"> -->
        <!-- <img src="" ref="code" @click="changeCode" alt="55555" /> -->
        <!-- <span ref="code"></span> -->
        <!-- </div> -->
        <!-- </el-form-item> -->
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :disabled="isdisabled"
            >登录</el-button
          >
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { logOn } from '@/api/login.js'
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '', //admin
        password: '' //123456
      },
      ifExist: '',
      isdisabled: true,
      captcha_code: '', //验证码字段
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        captcha_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '长度在 4 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // this.changeCode()
  },
  computed: {
    Exist() {
      return (this.ifExist =
        Number(Boolean(this.loginForm.username)) +
        Number(Boolean(this.loginForm.password)))
    }
  },
  watch: {
    ifExist(newVal, oldVal) {
      console.log('newVal', newVal)
      if (Number(newVal) === 2) {
        // 三个input框内都有值时需要做的操作
        this.isdisabled = false
      } else {
        // 至少一个没有值
        this.isdisabled = true
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // const { data: res } = await this.$http.post('login', this.loginForm)
        const { data: res } = await logOn(this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    },
    handleLogin() {
      console.log('2222', this.captcha_code)
    },
    random(a, b) {
      return Math.round(Math.random() * (a - b) + b)
    },
    getCaptchaKey() {
      // let captchaKey = Math.random()
      //   .toString(36)
      //   .substring(2)
      var str = ''
      for (var i = 0; i < 4; i++) {
        str = str + this.random(0, 9)
        str = str + String.fromCharCode(this.random(97, 122)) //
        str = str + String.fromCharCode(this.random(65, 90)) //随机得到4个大写字母
      }
      //先随机取十二个验证码，然后在十二个验证码里取四个
      console.log(str)
      var sStr = '' //声明一个字符变量讲的得到的值存到字符中
      for (var j = 0; j < 4; j++) {
        var index = this.random(0, str.length - 1)
        console.log(index) //在str.length-1里面得到随机数四位数
        sStr = sStr + str[index]
      }
      return sStr
    },
    changeCode() {
      console.log(this.$refs.code)
      console.log('888', this.getCaptchaKey())
      let captcha_key = this.getCaptchaKey()
      this.captcha_key = captcha_key
      this.$refs.code.innerHTML = captcha_key
      // this.$refs.code.setAttribute(
      //   'src',
      //   process.env.VUE_APP_API_URL +
      //     'auth/get_captcha?captcha_key=' +
      //     captcha_key
      //   // 'https://gimg2.baidu.com/image_search/src=http%3A%2…sec=1632298477&t=1c67a3ec25205a200f10d9420f8ef131.jpeg'
      // )
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 40%;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    text-align: center;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
.captcha_code {
  float: left;
  border: 1px solid #000;
  width: 122px;
  height: 38px;
  text-align: center;
}
</style>
