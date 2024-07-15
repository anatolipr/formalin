<script>
    let visible = false;
    let channel = '';

    function close() {
        visible = false;
    }

    //this is loaded once off

    window.addEventListener('message', (event) => {
        if (event.data.type === 'func' 
        && event.data.func === 'openFormalin') {
            channel = event.data.channel;
            visible = true;
        }
    });
</script>

{#if visible}
    <div class="back" on:click={close} role="none">
        <iframe src="https://formalin.netlify.app?channel={channel}" title=""></iframe>
    </div>
{/if}

<style>
    .back {
        background-color: #00000022; 
        width: 100vw; 
        height: 100%; 
        position: fixed; 
        display: flex; 
        align-items: center; 
        justify-content: center;
    }

    iframe {
        border: none;
        width: 1000px; 
        height: 563px;
    }
</style>