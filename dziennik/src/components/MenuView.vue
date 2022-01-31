<template>
  <div class="menu">
    <router-link :to="{name: 'users'}" v-if="isTeacher">Użytkownicy</router-link>
    <router-link :to="{name: 'subjects'}" v-if="isTeacher">Przedmioty</router-link>
    <router-link :to="{name: 'categories'}" v-if="isTeacher">Kategorie</router-link>
    <router-link :to="{name: 'notes'}">Oceny</router-link>
    <router-link :to="{name: 'logout'}">Wyloguj się</router-link>
  </div>  
</template>

<script>
export default {
  name: 'MenuView',
  props: ['isTeacher']
}
</script>