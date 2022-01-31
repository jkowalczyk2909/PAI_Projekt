<template>
  <div id="container">
    <h1 class="margin-top">Dodaj użytkownika</h1>

    <div class="status-bar error" v-if="status">Użytkownik z podanym loginem już istnieje</div>
    <form @submit.prevent="submitForm">
      <table class="tbl tbl-data margin-top">
        <tr>
          <th width="150px">Imię i nazwisko</th>
          <td width="250px"><input class="inp" v-model="name"></td>
        </tr>
        <tr>
          <th width="150px">Login</th>
          <td width="250px"><input class="inp" v-model="login"></td>
        </tr>
        <tr>
          <th width="150px">Hasło</th>
          <td width="250px"><input class="inp" type="password" v-model="password"></td>
        </tr>
        <tr>
          <th width="150px">Nauczyciel</th>
          <td width="250px">
            <select class="slc" v-model="teacher">
              <option>NIE</option>
              <option>TAK</option>
            </select>
          </td>
        </tr>
      </table>
      <button class="btn btn-width margin-top" type="submit">Dodaj</button>
      <button class="btn btn-width btn-cancel margin-top" type="button" @click="close()">Anuluj</button>
    </form>
  </div>
</template>

<script>
import http from "../../http-common"

export default {
  name: 'addUsersView',
  data(){
    return{
      name: '',
      login: '',
      password: '',
      teacher: 'NIE',
      status: false
    }
  },
  methods:{
    submitForm(){
      http.post("/api/users",{
        name: this.name,
        login: this.login,
        password: this.password,
        teacher: this.teacher
      }).then(results => {
        let json = results.data;

        this.status = !json.status;
        
        if (json.status)
        this.close();
    });
    },
    close(){
      this.$parent.reloadData();
      this.$router.push({name: 'users'});
    }
  },
  watch: {
    status(newValue){
      this.status = newValue;
    }
  }
}
</script>