<script>
    let visible = false;
    let channel = '';

    function close() {
        visible = false;
    }

    //this is loaded once off

    window.addEventListener('message', (event) => {
        if (event.data.type === 'openFormalinEdit') {
            channel = event.data.channel;
            visible = true;
        }
    });

    window.addEventListener('message', (event) => {
        if (event.data.type === 'closeFormalinEdit') {
            close();
        }
    });
</script>

{#if visible}
    <div class="back" on:click={close} role="none">
        <!-- <iframe src="http://localhost:4000?channel={channel}" title=""></iframe> -->
        <iframe src="https://formalin.netlify.app?channel={channel}" title=""></iframe>
    </div>
{/if}

<style>
    .back {
        background-color: #00000022; 
        width: 100vw; 
        height: 100%; 
        position: fixed; 
        z-index: 1000;
        top:0;
        left:0;
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