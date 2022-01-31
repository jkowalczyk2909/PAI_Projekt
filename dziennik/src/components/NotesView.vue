<template>
  <div id="container">
    <MenuView :isTeacher="isTeacher"></MenuView>
    <div class="body-cont">
      <small class="hello">Witaj, <b>{{user}}</b> <i>{{role}}</i></small>
      <div class="body">
        <div class="align-left">
          <h3>{{isTeacher ? "Oceny uczniów": "Moje oceny"}}</h3>
        </div>
        <div class="align-right" v-if="isTeacher">
          Przedmiot:
          <select v-model="subject" class="slc">
            <option value="-" disabled>--Wybierz--</option>
            <option v-for="(val, i) in przedmioty" :key="i" :value="val.id">{{val.name}}</option>
          </select>
        </div>
        <table class="tbl">
          <tr>
            <th :width="isTeacher ? '300px' : '200px'">{{isTeacher ? "Uczeń" : "Przedmiot"}}</th>
            <th width="400px">Oceny</th>
            <th width="75px">Średnia</th>
          </tr>
          <tr v-for="item in data" :key="item.name">
            <td>
              <button class="btn btn-small" @click="$router.push({name: 'addNote', params: {id: subject, student: item.id} })" v-if="isTeacher">+</button>
              {{item.name}}
            </td>
            <td>
              <span class="note" :style="{background: note.color}" @click="editNote(note)" v-for="note in item.notes" :key="note.value">{{note.value}}</span>
            </td>
            <td class="align-center">{{item.avg}}</td>
          </tr>
          <tr v-if="data.length == 0">
            <td colspan="3" class="align-center">Brak danych</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Side -->
    <div class="side-panel-bg" v-if="sidePanel" @click="$router.push({name: 'notes'})"></div>
    <div class="side-panel" :class="{active: sidePanel}">
      <router-view/>
    </div>
  </div>
</template>

<script>
import http from "../http-common"
import MenuView from "./MenuView"

export default {
  name: 'NotesView',
  components:{
    MenuView
  },
  data(){
    return{
      user: localStorage.name,
      isTeacher: localStorage.teacher == "true",
      role: localStorage.teacher == "true" ? "[nauczyciel]" : "[uczeń]",
      subject: '-',
      data: [],
      przedmioty: []
    }
  },
  methods:{
	editNote(note){
		if (this.isTeacher)
		this.$router.push({name: 'editNote', params: {id: note.id}})
	},
    reloadData(){
      let teacher = this.isTeacher ? 1 : 0;
      let subject = this.isTeacher ? this.subject : localStorage.user_id;

      http.get("/api/subject").then(results => {
        let json = results.data;

        this.przedmioty = json;

        if (this.subject == "-")
        this.subject = json[0].id;
      });
      http.get("/api/notes/"+subject+"/"+teacher).then(results => {
        let json = results.data;
        this.data = json;
      });
    }
  },
  computed:{
    sidePanel(){
      let sideArray = [
        "/notes/add/note/"+this.$route.params.student+"/"+this.$route.params.id,
        "/notes/edit/note/"+this.$route.params.id,
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
    },
    subject(newValue){
      this.reloadData();
      this.subject = newValue;
    }
  }
}
</script>