<template>
  <div id="container">
    <h1 class="margin-top">Dodaj ocenę</h1>

    <div class="status-bar error" v-if="status">Wypełnij wszystkie pola</div>
    <form @submit.prevent="submitForm">
      <table class="tbl tbl-data margin-top">
        <tr>
          <th width="150px">Ocena</th>
          <td width="250px">
            <select class="slc" v-model="note">
              <option value="-" disabled>--Wybierz--</option>
              <option v-for="value in notes" :key="value">{{value}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <th width="150px">Kategoria</th>
          <td width="250px">
            <select class="slc" v-model="category">
              <option value="-" disabled>--Wybierz--</option>
              <option v-for="value in categories" :key="value.name" :value="value.id">{{value.name}} ({{value.weight}})</option>
            </select>
          </td>
        </tr>
        <tr>
          <th width="150px">Przedmiot</th>
          <td width="250px">{{subject_name}}</td>
        </tr>
        <tr>
          <th width="150px">Uczeń</th>
          <td width="250px">{{student_name}}</td>
        </tr>
        <tr>
          <th width="150px">Opis</th>
          <td width="250px"><input class="inp" v-model="comment"></td>
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
  name: 'addNoteView',
  data(){
    return{
      isTeacher: localStorage.teacher == "true",
      note: '-',
      notes: ['6','6-','5+','5','5-','4+','4','4-','3+','3','3-','2+','2','2-','1+','1','+','-','np','bz'],
      category: '-',
      categories: [],
      comment: [],
      subject_name: '',
      student_name: '',
      status: false
    }
  },
  async mounted(){
    await http.get("/api/subject_name/"+this.$route.params.student+"/"+this.$route.params.id).then(results => {
      let json = results.data;
      this.subject_name = json.subject;
      this.student_name = json.student;
    });

    await http.get("/api/category").then(results => {
      let json = results.data;

      this.categories = json;
    });
  },
  methods:{
    submitForm(){
      http.post("/api/note",{
        note: this.note,
        category: this.category,
        comment: this.comment,
        subject_id: this.$route.params.id,
        student_id: this.$route.params.student
      }).then(results => {
        let json = results.data;

        this.status = !json.status;
        
        if (json.status)
        this.close();
    });
    },
    close(){
      this.$parent.reloadData();
      this.$router.push({name: 'notes'});
    }
  },
  watch: {
    status(newValue){
      this.status = newValue;
    },
    categories(newValue){
      this.categories = newValue;
    },
    subject_name(newValue){
      this.subject_name = newValue;
    },
    student_name(newValue){
      this.student_name = newValue;
    }
  }
}
</script>