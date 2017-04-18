import { mapMutations } from 'vuex'

export function handleAuthFail(err) {
  this.$notify({
    type: "warning",
    title: err.data.errName,
    message: err.data.errMessage
  });  

  if(err.status == 401) {
    let logout = mapMutations(["logoutSuccess"]).logoutSuccess
    setTimeout(() => {
      logout();
      sessionStorage.removeItem("token");
      this.$router.push({path: '/login'});
    }, 2000);    
  }
}