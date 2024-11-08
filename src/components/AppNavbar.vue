<template>
    <header :class="{ 'small': isScrolled }">
        <h1>Strumenti Matematici</h1>
    </header>
</template>


<script>
export default {
    props: ['isScrolled']
};
</script>

<style>
header {
    width: 100%;
    background-color: #3e8ed0;
    color: white;
    text-align: center;
    padding: 20px;
    transition: padding 0.3s, font-size 0.3s;
}
header.small {
    padding: 10px;
    font-size: 0.8em;
}
</style>
