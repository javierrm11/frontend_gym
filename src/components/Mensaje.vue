<template>
    <div id="info">
        <p>{{ $route.query.msg }}</p>
        <a href="/">Volver</a>
    </div>
</template>

<script>

export default({
    name: 'MensajeInfo',
})
</script>
