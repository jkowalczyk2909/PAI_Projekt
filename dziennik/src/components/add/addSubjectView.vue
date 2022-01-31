<template>
  <div id="container">
    <h1 class="margin-top">Dodaj przedmiot</h1>

    <div class="status-bar error" v-if="status">Istnieje już przedmiot o tej nazwie</div>
    <form @submit.prevent="submitForm">
      <table class="tbl tbl-data margin-top">
        <tr>
          <th width="150px">Nazwa</th>
          <td width="250px"><input class="inp" v-model="name"></td>
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
  name: 'addSubjectView',
  data(){
    return{
      name: '',
      status: false
    }
  },
  methods:{
    submitForm(){
      http.post("/api/subject",{
        name: this.name
      }).then(results => {
        let json = results.data;

        this.status = !json.status;
        
        if (json.status)
        this.close();
    });
    },
    close(){
      this.$parent.reloadData();
      this.$router.push({name: 'subjects'});
    }
  },
  watch: {
    status(newValue){
      this.status = newValue;
    }
  }
}
</script>