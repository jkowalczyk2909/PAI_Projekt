<template>
  <div id="container">
    <div class="login-cont">
      <h2>Zaloguj się</h2>

      <div class="status-bar error" v-if="sessionExpired">Zaloguj się ponownie</div>
      <div class="status-bar error" v-if="status">Podany login lub hasło jest nieprawidłowe</div>
      
      <form @submit.prevent="formSubmit()">
        <input class="inp inp-login" v-model="login" placeholder="Login">
        <input class="inp inp-login" v-model="password" type="password" placeholder="Hasło">
        <button class="btn margin-top" type="submit">Zaloguj się</button>
      </form>
    </div>
  </div>
</template>

<script>
import http from "../http-common"

export default {
  name: "LoginView",
  data(){
    return {
      login: 'kamil',
      password: 'test00',
      status: false,
      sessionExpired: false
    };
  },
  mounted(){
    localStorage.clear();
  },
  methods: {
    formSubmit(){
      http.post("/api/login",{
        login: this.login,
        password: this.password
      }).then(results => {
        let json = results.data;

        this.status = !json.status;

        if (json.status){
          localStorage.user_id = json.user_id;
          localStorage.teacher = json.teacher;
          localStorage.name = json.name;

          this.$router.push({name: "notes"});
        }
      })
    }
  },
  watch:{
    status(newValue){
      this.status = newValue;
    },
    sessionExpired(newValue){
      this.sessionExpired = newValue;
    }
  }
};
</script>
