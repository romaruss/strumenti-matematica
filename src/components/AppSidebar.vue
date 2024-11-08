<template>
    <nav class="sidebar">
        <h2>Funzionalità</h2>
        <ul>
            <li><router-link to="/estrazioneOperazioni">Operazioni</router-link></li>
            <li><router-link to="/">Armadio del 100</router-link></li>
            <li><router-link to="/">Tabelline</router-link></li>
            <li><router-link to="/">Home</router-link></li>
        
        </ul>
    </nav>
</template>

<style>
.sidebar {
    width: 250px;
    background-color: #f8f9fa;
    padding: 20px;
    border-left: 2px solid #3e8ed0;
    position: sticky;
    top: 0;
    height: 100vh;
}
.sidebar ul {
    list-style-type: none;
    padding: 0;
}
.sidebar li {
    margin: 15px 0;
}
.sidebar a {
    color: #3e8ed0;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
}
.sidebar a:hover {
    color: #265a8f;
}
</style>
