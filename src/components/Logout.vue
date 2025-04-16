<script>
export default {
    name: 'LogoutUser',
    methods: {
        async handleLogout() {
            if (this.$store.getters.isLoggedIn) {
                await this.$store.dispatch('logout');
                this.$router.push('/');
            }
        }
    },
    created() {
        this.handleLogout();
    }
}
</script>
