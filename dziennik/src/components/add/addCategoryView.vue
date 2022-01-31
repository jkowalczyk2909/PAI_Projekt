<template>
  <div id="container">
    <h1 class="margin-top">Dodaj kategorię</h1>

    <div class="status-bar error" v-if="status">Wypełnij wszystkie pola</div>
    <form @submit.prevent="submitForm">
      <table class="tbl tbl-data margin-top">
        <tr>
          <th width="150px">Nazwa</th>
          <td width="250px"><input class="inp" v-model="name"></td>
        </tr>
        <tr>
          <th width="150px">Kolor</th>
          <td width="250px"><InputColorPicker v-model="color"/></td>
        </tr>
        <tr>
          <th width="150px">Waga</th>
          <td width="250px"><input type="number" class="inp" v-model="weight"></td>
        </tr>
      </table>
      <button class="btn btn-width margin-top" type="submit">Dodaj</button>
      <button class="btn btn-width btn-cancel margin-top" type="button" @click="close()">Anuluj</button>
    </form>
  </div>
</template>

<script>
import http from "../../http-common"
import InputColorPicker from 'vue-native-color-picker'

export default {
  name: 'addCategoryView',
  components: {
    InputColorPicker
  },
  data(){
    return{
      name: '',
      weight: 1,
      color: '#ffb400',
      status: false
    }
  },
  methods:{
    submitForm(){
      http.post("/api/category",{
        name: this.name,
        weight: this.weight,
        color: this.color
      }).then(results => {
        let json = results.data;

        this.status = !json.status;
        
        if (json.status)
        this.close();
    });
    },
    close(){
      this.$parent.reloadData();
      this.$router.push({name: 'categories'});
    }
  },
  watch: {
    status(newValue){
      this.status = newValue;
    }
  }
}
</script>