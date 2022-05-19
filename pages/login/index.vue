<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{isLogin ? 'Sign in' : 'Sign up'}}</h1>
          <p class="text-xs-center">
            <!-- <a href>Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <!-- 遍历errors对象，fied为错误类型，messages为错误信息 -->
            <template v-for="(messages, field) in errors">
              <li
                v-for="(message, index) in messages"
                :key="index"
              >{{ field }} {{ message }}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input class="form-control form-control-lg" type="text" placeholder="Your Name" required v-model="user.username"/>
            </fieldset>
            <fieldset class="form-group">
              <input required class="form-control form-control-lg" type="email" placeholder="Email" v-model="user.email"/>
            </fieldset>
            <fieldset class="form-group">
              <input required class="form-control form-control-lg" type="password" placeholder="Password" v-model="user.password" minlength="8"/>
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">{{isLogin ? 'Sign in' : 'Sign up'}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
// 仅在客户端加载js-cookie包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'LoginIndex',
  middleware: 'notAuthenticated',
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
  },
  data () {
    return {
      user: {
        username: '',
        email: 'yk19980811@163.com',
        password: 'yk08110620'
      },
      errors: {}
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 提交登录表单
        const { data } = this.isLogin
          ? await login({
              user: this.user
            })
          : await register({
              user: this.user
            })
        // 保存用户登录状态
        this.$store.commit('setUser', data.user)
        // 数据持久化
        Cookie.set('user', data.user)
        // 路由跳转
        this.$router.push('/')
      } catch (err) {
        console.dir(err)
        this.errors = err.response.data.errors
      }
      
    }
  }
}
</script>

<style>
</style>