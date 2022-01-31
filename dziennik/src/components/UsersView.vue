<template>
  <div id="container">
    <MenuView :isTeacher="isTeacher"></MenuView>
    <div class="body-cont">
      <small class="hello">Witaj, <b>{{user}}</b> <i>{{role}}</i></small>
      <div class="body">
        <div class="align-left">
          <h3>Użytkownicy</h3>
        </div>
        <div class="align-right">
          <button class="btn btn-small" @click="$router.push({name: 'addUser'})">Dodaj użytkownika</button>
        </div>
        <table class="tbl">
          <tr>
            <th width="40px">Lp.</th>
            <th width="300px">Imię i nazwisko</th>
            <th width="150px">Login</th>
            <th width="100px">Nauczyciel</th>
          </tr>
          <tr v-for="(item, index) in uzytkownicy" :key="item.name">
            <td class="align-center">{{index+1}}</td>
            <td><router-link :to="{name: 'editUser', params: {id: item.id}}">{{item.full_name}}</router-link></td>
            <td>{{item.login}}</td>
            <td class="align-center">{{item.teacher ? "TAK" : ""}}</td>
          </tr>
          <tr v-if="uzytkownicy.length == 0">
            <td colspan="4" class="align-center">Brak danych</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Side -->
    <div class="side-panel-bg" v-if="sidePanel" @click="$router.push({name: 'users'})"></div>
    <div class="side-panel" :class="{active: sidePanel}">
      <router-view/>
    </div>
  </div>
</template>

<script>
import http from "../http-common"
import MenuView from "./MenuView"

export default {
  name: 'UsersView',
  components:{
    MenuView
  },
  data(){
    return{
      user: localStorage.name,
      isTeacher: localStorage.teacher == "true",
      role: localStorage.teacher == "true" ? "[nauczyciel]" : "[uczeń]",
      uzytkownicy: []
    }
  },
  methods:{
    reloadData(){
      http.get("/api/users").then(results => {
        let json = results.data;

        this.uzytkownicy = json;
      });
    }
  },
  computed:{
    sidePanel(){
      let sideArray = [
        "/users/add/user",
        "/users/edit/user/"+this.$route.params.id,
      ]
      
      return sideArray.includes(this.$route.path);
    }
  },
  mounted(){
    this.reloadData();
  },
  watch: {
    data(newValue){
      this.data = newValue;
    },
    uzytkownicy(newValue){
      this.uzytkownicy = newValue;
    },
    '$route'(){
      this.reloadData();
    }
  }
}
</script>