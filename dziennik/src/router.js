import Vue from "vue";
import Router from "vue-router";
import LoginView from "./components/LoginView"

import NotesView from "./components/NotesView"
import addNoteView from "./components/add/addNoteView"
import editNoteView from "./components/edit/editNoteView"

import SubjectsView from "./components/SubjectsView"
import addSubjectView from "./components/add/addSubjectView"
import editSubjectView from "./components/edit/editSubjectView"

import CategoriesView from "./components/CategoriesView"
import addCategoryView from "./components/add/addCategoryView"
import editCategoryView from "./components/edit/editCategoryView"

import UsersView from "./components/UsersView"
import addUsersView from "./components/add/addUsersView"
import editUsersView from "./components/edit/editUsersView"

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/logout",
      name: "logout",
      redirect: {name: 'login', query: {logout: true}}
    },
    {
      path: "/subjects",
      name: "subjects",
      component: SubjectsView,
      meta: { protected: true, teacherOnly: true },
      children:[
        {path: "add/subject", name: "addSubject", component: addSubjectView, meta: {protected: true, teacherOnly: true }},
        {path: "edit/subject/:id", name: "editSubject", component: editSubjectView, meta: {protected: true, teacherOnly: true }},
      ]
    },
    {
      path: "/categories",
      name: "categories",
      component: CategoriesView,
      meta: { protected: true, teacherOnly: true },
      children:[
        {path: "add/category", name: "addCategory", component: addCategoryView, meta: {protected: true, teacherOnly: true }},
        {path: "edit/category/:id", name: "editCategory", component: editCategoryView, meta: {protected: true, teacherOnly: true }},
      ]
    },
    {
      path: "/users",
      name: "users",
      component: UsersView,
      meta: { protected: true, teacherOnly: true },
      children:[
        {path: "add/user", name: "addUser", component: addUsersView, meta: {protected: true, teacherOnly: true }},
        {path: "edit/user/:id", name: "editUser", component: editUsersView, meta: {protected: true, teacherOnly: true }},
      ]
    },
    {
      path: "/notes",
      name: "notes",
      component: NotesView,
      meta: { protected: true, teacherOnly: true  },
      children:[
        {path: "add/note/:student/:id", name: "addNote", component: addNoteView, meta: {protected: true, teacherOnly: true }},
        {path: "edit/note/:id", name: "editNote", component: editNoteView, meta: {protected: true, teacherOnly: true }},
      ]
    },
  ]
});