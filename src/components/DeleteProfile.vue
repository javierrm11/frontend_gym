<template>
    <main>
        <h2>Delete Profile</h2>
        <p>Are you sure you want to delete your profile?</p>
        <button @click="deleteProfile">Delete</button>
    </main>
</template>

<script>
import axios from 'axios';

export default {
    name: 'DeleteProfile',
    methods: {
        async deleteProfile() {
            try {
                await axios.delete(`${process.env.VUE_APP_BASE_URL}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                await this.$store.dispatch('logout');
                this.$router.push('/');
            } catch (error) {
                console.error('Error deleting profile:', error);
            }
        }
    }
}
</script>

<style>

</style>