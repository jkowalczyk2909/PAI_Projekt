<template>
  <div id="container">
    <MenuView :isTeacher="isTeacher"></MenuView>
    <div class="body-cont">
      <small class="hello">Witaj, <b>{{user}}</b> <i>{{role}}</i></small>
      <div class="body">
        <div class="align-left">
          <h3>Przedmioty</h3>
        </div>
        <div class="align-right">
          <button class="btn btn-small" @click="$router.push({name: 'addSubject'})">Dodaj przedmiot</button>
        </div>
        <table class="tbl">
          <tr>
            <th width="40px">Lp.</th>
            <th width="200px">Nazwa</th>
          </tr>
          <tr v-for="(item, index) in przedmioty" :key="item.name">
            <td class="align-center">{{index+1}}</td>
            <td><router-link :to="{name: 'editSubject', params: {id: item.id}}">{{item.name}}</router-link></td>
          </tr>
          <tr v-if="przedmioty.length == 0">
            <td colspan="2" class="align-center">Brak danych</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Side -->
    <div class="side-panel-bg" v-if="sidePanel" @click="$router.push({name: 'subjects'})"></div>
    <div class="side-panel" :class="{active: sidePanel}">
      <router-view/>
    </div>
  </div>
</template>

<script>
import http from "../http-common"
import MenuView from "./MenuView"

export default {
  name: 'SubjectsView',
  components:{
    MenuView
  },
  data(){
    return{
      user: localStorage.name,
      isTeacher: localStorage.teacher == "true",
      role: localStorage.teacher == "true" ? "[nauczyciel]" : "[uczeń]",
      przedmioty: []
    }
  },
  methods:{
    reloadData(){
      http.get("/api/subject").then(results => {
        let json = results.data;

        this.przedmioty = json;
      });
    }
  },
  computed:{
    sidePanel(){
      let sideArray = [
        "/subjects/add/subject",
        "/subjects/edit/subject/"+this.$route.params.id,
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
    przedmioty(newValue){
      this.przedmioty = newValue;
    }
  }
}
</script>