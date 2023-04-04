<template>
    <p>Hi</p>
    <div>
        <iframe :src="linkVideo" width="640" height="480" allow="autoplay"></iframe>
    </div>
</template>

<script>
export default {
    name: "VeureVideoComp",
    data() {
        return {
            codiVideo: '18kHpdpqGablq52Ndbq7HzjPYMbl-l587'
        };
    },
    computed: {
        linkVideo() {
            return 'https://drive.google.com/file/d/' + this.codiVideo + '/preview'
        }
    }
}
</script>