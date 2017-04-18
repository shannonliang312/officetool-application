import { mapMutations } from 'vuex'

export function handleAuthFail(err) {
  this.$notify({
    type: "warning",
    title: err.data.errName,
    message: err.data.errMessage
  });  

  if(err.status == "401") {

    setTimeout(() => {
      this.$store.commit("logoutSuccess");
      sessionStorage.removeItem("token");
      this.$router.push({path: '/login'});
    }, 2000);    
  }
}