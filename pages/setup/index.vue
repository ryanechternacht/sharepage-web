<script setup>
// TODO is this the best way to do this? I just want to forward
// /setup -> /setup/company

// TODO we could extend this to check each page and go to the next
// unfinished one?

await navigateTo({ path: '/setup/company' })
</script>