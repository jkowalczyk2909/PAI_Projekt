<template>
  <div id="container">
    <MenuView :isTeacher="isTeacher"></MenuView>
    <div class="body-cont">
      <small class="hello">Witaj, <b>{{user}}</b> <i>{{role}}</i></small>
      <div class="body">
        <div class="align-left">
          <h3>Kategorie ocen</h3>
        </div>
        <div class="align-right">
          <button class="btn btn-small" @click="$router.push({name: 'addCategory'})">Dodaj kategorię</button>
        </div>
        <table class="tbl">
          <tr>
            <th width="40px">Lp.</th>
            <th width="200px">Nazwa</th>
            <th width="75px">Waga</th>
            <th width="75px">Kolor</th>
          </tr>
          <tr v-for="(item, index) in kategorie" :key="item.name">
            <td class="align-center">{{index+1}}</td>
            <td><router-link :to="{name: 'editCategory', params: {id: item.id}}">{{item.name}}</router-link></td>
            <td class="align-center">{{item.weight}}</td>
            <td :style="{background: item.color}"></td>
          </tr>
          <tr v-if="kategorie.length == 0">
            <td colspan="4" class="align-center">Brak danych</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Side -->
    <div class="side-panel-bg" v-if="sidePanel" @click="$router.push({name: 'categories'})"></div>
    <div class="side-panel" :class="{active: sidePanel}">
      <router-view/>
    </div>
  </div>
</template>

<script>
import http from "../http-common"
import MenuView from "./MenuView"

export default {
  name: 'CategoriesView',
  components:{
    MenuView
  },
  data(){
    return{
      user: localStorage.name,
      isTeacher: localStorage.teacher == "true",
      role: localStorage.teacher == "true" ? "[nauczyciel]" : "[uczeń]",
      kategorie: []
    }
  },
  methods:{
    reloadData(){
      http.get("/api/category").then(results => {
        let json = results.data;

        this.kategorie = json;
      });
    }
  },
  computed:{
    sidePanel(){
      let sideArray = [
        "/categories/add/category",
        "/categories/edit/category/"+this.$route.params.id,
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
    kategorie(newValue){
      this.kategorie = newValue;
    }
  }
}
</script>