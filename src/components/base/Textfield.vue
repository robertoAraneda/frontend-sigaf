<template>
  <v-text-field
    color="blueS"
    dense
    outlined
    v-bind="$attrs"
    v-on="$listeners"
  ></v-text-field>
</template>
<script>
export default {
  inheritAttrs: false,
  name: 'BaseTextfield'
}
</script>
