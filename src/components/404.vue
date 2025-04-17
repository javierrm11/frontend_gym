<template>
    <div class="container">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <router-link to="/">Go back to Home</router-link>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
}
</script>

<style>
.container {
    text-align: center;
    margin-top: 50px;
}
h1 {
    font-size: 2em;
    color: #333;
}
p {
    font-size: 1.2em;
    color: #666;
}
.container a {
    text-decoration: none;
    color: white;
    background-color: red;
    padding: 10px 20px;
    border-radius: 5px;

}

</style>